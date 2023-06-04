from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

from events.models import Calendar
from events.tests.clients import BaseAPITestCase

User = get_user_model()


class CalendarTest(BaseAPITestCase):
    """
    Тестирование доступности эндопойнтов calendar приложения events.
    """

    def test_get_calendar_list(self):
        """
        Получение списка календарей.

        У анонима нет доступа к списку календарей.
        У пользователя есть доступ к списку календарей.
        У админа есть доступ к списку календарей.
        """

        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_200_OK),
            (self.owner, status.HTTP_200_OK),
            (self.admin, status.HTTP_200_OK),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.get(reverse('calendars-list'))
                self.assertEqual(
                    response.status_code,
                    expected_code,
                    f'{client.name} должен получить статус {expected_code}'
                    f'для GET-запроса на api/v1/calendars/'
                )

    def test_get_calendar_list_permission(self):
        """
        Получение правильного кверисета календарей.

        У пользователя есть доступ только к своим календарям.
        У админа есть доступ ко всем календарям.
        """

        response = self.owner.get(reverse('calendars-list'))
        qs_calendars = response.data
        amount_calendar_owner = len([
            calendar for calendar in qs_calendars if calendar.get(
                'owner') == 'owner@user.com'
        ])
        self.assertEqual(
            len(qs_calendars), amount_calendar_owner,
            'Пользователь должен получить только свои календари'
        )

        response = self.admin.get(reverse('calendars-list'))
        qs_calendars = response.data
        amount_all_calendars = Calendar.objects.all().count()
        self.assertEqual(
            len(qs_calendars), amount_all_calendars,
            'Админ должен получить все календари'
        )

    def test_create_calendar(self):
        """
        Создание календаря.

        У анонима нет доступа к созданию календарей.
        У пользователя и админа есть доступ к созданию каледарей.
        """

        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_201_CREATED),
            (self.admin, status.HTTP_201_CREATED),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.post(
                    reverse('calendars-list'),
                    {
                        'name': 'test_calendar',
                        'color': '#FFF000',
                    }
                )
                self.assertEqual(
                    response.status_code, expected_code,
                    f'{client.name} должен получить статус {expected_code} '
                    f'для POST-запроса на api/v1/calendars/'
                )

    def test_put_and_patch_calendar(self):
        """
        Редактирование календарей.

        У анонима нет доступа к редактированию календарей.
        У пользователя есть доступ к редактированию только своих календарей.
        У админа есть доступ к редактированию всех календарей.
        """

        owner_id = User.objects.get(username='owner').id
        calendar_id = Calendar.objects.get(owner_id=owner_id).id
        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_404_NOT_FOUND),
            (self.owner, status.HTTP_200_OK),
            (self.admin, status.HTTP_200_OK),
        )

        for client, expected_code in cases:
            for method in [client.put, client.patch]:
                with self.subTest((client.name, method.__name__)):
                    response = method(
                        reverse('calendars-detail', args=(calendar_id,)),
                        {'name': 'new_calendar_name',
                         'color': '#FFF000'}
                    )
                    self.assertEqual(
                        response.status_code, expected_code,
                        f'{client.name} должен получить статус {expected_code}'
                        f' для {method.__name__.upper()}-запроса '
                        f'на api/v1/calendars/<calendar_id>/'
                    )

    @patch('events.models.Calendar.delete')
    def test_delete_calendar(self, mock_delete):
        """
        Удаление календарей.

        У анонима нет доступа к удалению календарей.
        У пользователя есть доступ к удалению только своих календарей.
        У админа есть доступ к удалению всех календарей.
        """

        mock_delete.return_value = None
        owner_id = User.objects.get(username='owner').id
        calendar_id = Calendar.objects.get(owner_id=owner_id).id
        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_404_NOT_FOUND),
            (self.owner, status.HTTP_204_NO_CONTENT),
            (self.admin, status.HTTP_204_NO_CONTENT),
        )

        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.delete(
                    reverse('calendars-detail', args=(calendar_id,)),
                )
                self.assertEqual(
                    response.status_code, expected_code,
                    f'{client.name} должен получить статус {expected_code}'
                    f' для DELETE-запроса '
                    f'на api/v1/calendars/<calendar_id>/'
                )
