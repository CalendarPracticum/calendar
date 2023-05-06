import os

from django.core.management import call_command
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from events.models import Event


class AnonymousEventTest(APITestCase):
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

    def test_get_events_list(self):
        """
        Тестирование доступности списка событий для анонима.
        """

        response = self.client.get(
            reverse('events-list'),
            data={
                'datetime_start_after': '2023-01-01',
                'datetime_start_before': '2023-12-01'
            }
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            'Аноним должен получить статус 200 для GET-запроса на api/v1/events/ '
        )

    def test_get_one_of_global_event(self):
        """
        Тестирование доступности общего события для анонима.

        Анонимный пользователь должен иметь доступ к событиям из глобального
        календаря — Праздники РФ, выходные дни и прочее.
        """

        response = self.client.get(reverse('events-detail', args=(1,)))
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            'Аноним должен получить статус 200 для GET-запроса на api/v1/events/<events_id>'
        )

    def test_get_one_of_users_event(self):
        """
        Тестирование доступности пользовательского события для анонима.

        Анонимный пользователь НЕ должен иметь доступ к событиям
        других пользователей.
        """

        event_id = Event.objects.get(name='test_event').id
        response = self.client.get(reverse('events-detail', args=(event_id,)))

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
            'Аноним должен получить статус 403 для GET-запроса '
            'на api/v1/events/<events_id>, '
            'если запрашиваемое событие принадлежит другому пользователю'
        )

    def test_delete_event(self):
        """
        Тестирование доступности удаления события анонимом.
        """

        response = self.client.delete(reverse('events-detail', args=(1,)))
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
            'Аноним должен получить статус 403 для DELETE-запроса на api/v1/events/<events_id>'
        )

    def test_put_and_patch_event(self):
        """
        Тестирование доступности редактирования события анонимом.
        """

        name_first_event = Event.objects.get(pk=1).name
        methods = [
            self.client.patch,
            self.client.put
        ]
        for method in methods:
            with self.subTest(method=method.__name__):
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
                    status.HTTP_403_FORBIDDEN,
                    f'Аноним должен получить статус 403 для '
                    f'{method.__name__.upper()}-запроса'
                    f' на api/v1/events/<events_id>'
                )
                self.assertEqual(
                    response.data.get('name'),
                    name_first_event,
                    'Аноним не должен иметь доступ к редактированию событий'
                )

    def test_create_event(self):
        """
        Тестирование доступности создания события анонимом.
        """

        response = self.client.post(
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
            status.HTTP_403_FORBIDDEN,
            'Аноним должен получить статус 403 для POST-запроса на api/v1/events/'
        )
