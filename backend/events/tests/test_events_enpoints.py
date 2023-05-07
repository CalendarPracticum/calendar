import os
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from events.models import Event

User = get_user_model()


class EventTest(APITestCase):
    """
    Тестирование доступности эндопойнтов приложения events для анонима.
    """

    @classmethod
    def setUpTestData(cls):
        """
        Загрузка тестовых данных с помощью management-команды loaddata.
        """

        command_name = 'loaddata'
        fixture_path = os.path.join(os.path.dirname(__file__), 'data.json')
        call_command(command_name, fixture_path)

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        user = User.objects.get(email='test@user.com')
        owner = User.objects.get(email='owner@user.com')
        admin = User.objects.get(email='ad@min.com')

        cls.anon = APIClient(name='Анонимный пользователь')
        cls.user = APIClient(name='Обычный пользователь')
        cls.owner = APIClient(name='Владелец события')
        cls.admin = APIClient(name='Администратор')

        cls.user.force_authenticate(user)
        cls.owner.force_authenticate(owner)
        cls.admin.force_authenticate(admin)
        for client in (cls.anon, cls.user, cls.owner, cls.admin):
            client.name = client.defaults.get('name')

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
                        'datetime_start_after': '2023-01-01',
                        'datetime_start_before': '2023-12-01'
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
            (self.anon, status.HTTP_403_FORBIDDEN),
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
            (self.anon, status.HTTP_403_FORBIDDEN),
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
            (self.anon, status.HTTP_403_FORBIDDEN),
            (self.user, status.HTTP_403_FORBIDDEN),
            (self.owner, status.HTTP_403_FORBIDDEN),
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
        Поле calendar должно валидироваться: при создании пользователь может
        указать только тот календарь, владельцем которого он является.
        """

        cases = (
            (self.anon, status.HTTP_403_FORBIDDEN),
            (self.user, status.HTTP_403_FORBIDDEN),
            (self.owner, status.HTTP_400_BAD_REQUEST),
            (self.admin, status.HTTP_200_OK),
        )

        for client, expected_code in cases:
            for method in [client.put, client.patch]:
                with self.subTest((client.name, method.__name__)):

                    response = method(
                        reverse('events-detail', args=(1,)),
                        data={
                            'datetime_start': '2023-01-01T00:00:00',
                            'name': 'new_name',
                            'category': 1,
                            'calendar': 1,
                        }
                    )
                    self.assertEqual(
                        response.status_code,
                        expected_code,
                        f'{client.name} должен получить статус {expected_code} '
                        f'для {method.__name__.upper()}-запроса '
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
            (self.anon, status.HTTP_403_FORBIDDEN),
            (self.user, status.HTTP_400_BAD_REQUEST),
            (self.admin, status.HTTP_201_CREATED),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.post(
                    reverse('events-list'),
                    data={
                        'datetime_start': '2023-01-01T00:00:00',
                        'name': 'test_name',
                        'category': 1,
                        'calendar': 1,
                    },
                    format='json',
                )
                self.assertEqual(
                    response.status_code,
                    expected_code,
                    f'{client.name} должен получить статус {expected_code}'
                    f' для POST-запроса на api/v1/events/'
                )
