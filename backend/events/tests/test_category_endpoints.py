from django.urls import reverse
from rest_framework import status

from events.tests.clients import BaseAPITestCase


class CategoryTest(BaseAPITestCase):
    """
    Тестирование доступности эндопойнтов категории приложения events.
    """
    def test_get_categories(self):
        """
        Получение категорий.
        """
        cases = (
            (self.anon, status.HTTP_401_UNAUTHORIZED),
            (self.user, status.HTTP_200_OK),
            (self.admin, status.HTTP_200_OK),
        )
        for client, expected_code in cases:
            with self.subTest(client.name):
                response = client.get(reverse('categories-list'))
                self.assertEqual(
                    response.status_code,
                    expected_code,
                    f'{client.name} должен получить статус {expected_code} '
                    f'для GET-запроса на api/v1/categories/'
                )
