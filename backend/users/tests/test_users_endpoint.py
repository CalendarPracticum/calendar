from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APITestCase

from users.models import SettingsUser

image = ('data:image/png;base64,'
         'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IA'
         'rs4c6QAAAA1JREFUGFdjUD9/4j8ABZ0Cvq0jV14AAAAASUVORK5CYII=')
User = get_user_model()


class CreateUserTest(APITestCase):
    """
    Тестирование эндпойнта создания экземпляра пользователя.
    """

    @classmethod
    def setUpClass(cls):
        """
        Отправка запроса на создание экземпляра пользователя.
        """

        super().setUpClass()
        url = reverse('user-list')
        data = {
            'username': 'test_user',
            'email': 'test@user.com',
            'password': 'testpassword',
            'profile_picture': image
        }
        client = APIClient()
        cls.response = client.post(url, data, format='json')

    def test_create_user_response(self):
        """
        Тестирование содержимого ответа после создания экземпляра пользователя.
        """

        response = CreateUserTest.response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        settings = response.data.pop('settings', None)
        self.assertEquals(settings, {'dark_mode': False, 'background': None})

        image_path = response.data.pop('profile_picture')
        self.assertEquals(
            response.data,
            {'id': 1, 'email': 'test@user.com', 'username': 'test_user'}
        )

        self.assertIn('/media/profile_pictures/photo_', image_path)

    def test_create_user_instances(self):
        """
        Проверка наличия экземпляров пользователя и его настроек.
        """

        self.assertTrue(
            User.objects.filter(username='test_user').exists()
        )
        self.assertTrue(
            SettingsUser.objects.filter(user__username='test_user').exists()
        )


class JwtAuthenticationTests(APITestCase):
    """
    Тестирование аутентификации через JWT токен.
    """

    def setUp(self):
        """
        Отправка запроса на получение токена.
        """

        self.user = User.objects.create_user(
            username='test_user',
            email='test@user.com',
            password='testpassword'
        )
        response = self.client.post(reverse('jwt-create'), {
            'email': 'test@user.com',
            'password': 'testpassword'
        }, format='json')
        self.token = response.data.get('access')

    def test_jwt_authorization(self):
        """
        Авторизация с помощью JWT токена.
        """

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        response = self.client.get(reverse('user-me'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AuthClientTest(APITestCase):
    """
    Тестирование доступности пользовательских эндпойнтов.
    """

    @classmethod
    def setUpClass(cls):
        """
        Создание и аутентификация пользователя.
        """
        super().setUpClass()

        user = User.objects.create_user(
            username='test_user',
            email='test@user.com',
            password='testpassword',
        )
        cls.client = APIClient()
        cls.client.force_authenticate(user)

    def test_auth_access(self):
        """
        Тестирование эндпойнтов получения/редактирования/удаления.
        """

        client = AuthClientTest.client
        response = client.get(reverse('user-me'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.patch(
            reverse('user-me'),
            {'username': 'else_new_name'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.delete(
            reverse('user-me'),
            {'current_password': 'testpassword'}
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
