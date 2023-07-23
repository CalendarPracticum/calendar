import unittest
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.db import connection
from django.urls import reverse
from rest_framework import status

from events.models import Event
from events.tests.clients import BaseAPITestCase

User = get_user_model()


class EventTest(BaseAPITestCase):
    """
    Тестирование доступности эндопойнтов приложения events.
    """

    @unittest.skipIf(
        connection.vendor == 'sqlite',
        'Skip test if using SQLite'
    )
    def test_get_events_list(self):
        """
        Получить список событий.

        Все пользователи должны иметь доступ к событиям из глобального
        календаря — Праздники РФ, выходные дни и прочее.
        """

        cases = (
            (self.anon, status.HTTP_200_OK),
            (self.user, status.HTTP_200_OK),
            (self.admin, status.HTTP_200_OK),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.get(
                    reverse('events-list'),
                    data={
                        'start_dt': '2023-01-01',
                        'finish_dt': '2023-12-01',
                        'calendar': 1,
                    }
                )
                self.assertEqual(
                    response.status_code,
                    expected_code,
                    f'{client.name} должен получить статус {expected_code}'
                    f' для GET-запроса на api/v1/events/ '
                )

    def test_get_one_of_global_event(self):
        """
        Получить общее события.

        Все пользователи должны иметь доступ к событиям из глобального
        календаря — Праздники РФ, выходные дни и прочее.
        """

        cases = (
            (self.anon, status.HTTP_200_OK),
            (self.user, status.HTTP_200_OK),
            (self.admin, status.HTTP_200_OK),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.get(reverse('events-detail', args=(1,)))
                self.assertEqual(
                    response.status_code,
                    status.HTTP_200_OK,
                    f'{client.name} должен получить статус {expected_code}'
                    f' для GET-запроса на api/v1/events/<event_id>,'
                    f'где event — общее событие'
                )

    def test_get_one_of_users_event(self):
        """
        Получить пользовательское событие.

        Обычный пользователь и аноним НЕ должны иметь доступ к событиям
        других пользователей.
        """

        event_id = Event.objects.get(name='test_event').id
        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_403_FORBIDDEN),
            (self.owner, status.HTTP_200_OK),
            (self.admin, status.HTTP_200_OK),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.get(
                    reverse('events-detail', args=(event_id,))
                )
                self.assertEqual(
                    response.status_code,
                    expected_code,
                    f'{client.name} должен получить статус {expected_code} '
                    f'для GET-запроса на api/v1/events/<event_id>'
                )

    @patch('events.models.Event.delete')
    def test_delete_users_event(self, mock_delete):
        """
        Удаление пользовательского события.

        Событие может удалить только владелец или администратор.
        """

        mock_delete.return_value = None
        event_id = Event.objects.get(name='test_event').id
        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_403_FORBIDDEN),
            (self.owner, status.HTTP_204_NO_CONTENT),
            (self.admin, status.HTTP_204_NO_CONTENT),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.delete(
                    reverse('events-detail', args=(event_id,))
                )
                self.assertEqual(
                    response.status_code,
                    expected_code,
                    f'{client.name} должен получить статус {expected_code}'
                    f' для DELETE-запроса на api/v1/events/<event_id>'
                )

    @patch('events.models.Event.delete')
    def test_delete_global_event(self, mock_delete):
        """
        Удаление общего события.

        Событие может удалить только администратор.
        """

        mock_delete.return_value = None
        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_403_FORBIDDEN),
            (self.admin, status.HTTP_204_NO_CONTENT),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.delete(
                    reverse('events-detail', args=(1,))
                )
                self.assertEqual(
                    response.status_code,
                    expected_code,
                    f'{client.name} должен получить статус {expected_code}'
                    f' для DELETE-запроса на api/v1/events/<event_id>,'
                    f'где event — общее событие'
                )

    def test_put_and_patch_global_event(self):
        """
        Редактирования общего события.

        Общее событие может редактировать только администратор.
        Поле calendar должно валидироваться: пользователь может
        указать только тот календарь, владельцем которого он является.
        """

        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_403_FORBIDDEN),
            (self.admin, status.HTTP_200_OK),
        )

        for client, expected_code in cases:
            for method in [client.put, client.patch]:
                with self.subTest((client.name, method.__name__)):

                    response = method(
                        reverse('events-detail', args=(1,)),
                        data={
                            'datetime_start': '2023-01-01T00:00:00',
                            'datetime_finish': '2023-12-01T00:00:00',
                            'name': 'new_name',
                            'calendar': 1,
                        }
                    )
                    self.assertEqual(
                        response.status_code,
                        expected_code,
                        f'{client.name} должен получить статус {expected_code}'
                        f' для {method.__name__.upper()}-запроса '
                        f'на api/v1/events/<events_id>,'
                        f'где event — общее событие'
                    )

    def test_create_event_with_admin_calendar(self):
        """
        Создание общего события в глобальном календаре.

        Анонимные пользователи не могут создавать события.
        Поле calendar должно валидироваться: при создании пользователь может
        указать только тот календарь, владельцем которого он является.
        """

        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_400_BAD_REQUEST),
            (self.admin, status.HTTP_201_CREATED),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.post(
                    reverse('events-list'),
                    data={
                        'datetime_start': '2023-01-01T00:00:00',
                        'datetime_finish': '2023-01-01T00:01:00',
                        'name': 'test_name',
                        'calendar': 1,
                    },
                    format='json',
                )
                self.assertEqual(
                    response.status_code,
                    expected_code,
                    f'{client.name} должен получить статус {expected_code}'
                    f' для POST-запроса на api/v1/events/ '
                    f'при попытке создать событие с календарем админа.'
                )
