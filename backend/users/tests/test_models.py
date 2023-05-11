from django.contrib.auth import get_user_model
from django.test import TestCase

User = get_user_model()


class UserTest(TestCase):
    """
    Тесты создания пользователя/настроек и метода __str__.
    """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User.objects.create_user(
            email='test@user.com',
            password='test1234',
        )

    def test_user_str(self):
        user = UserTest.user
        self.assertEqual(str(user), user.email)

    def test_create_settings(self):
        user = UserTest.user
        self.assertEqual(
            str(user.settings),
            f'Настройки пользователя {self.user}'
        )
