import os

from django.contrib.auth import get_user_model
from django.core.management import call_command
from rest_framework.test import APITestCase, APIClient

User = get_user_model()


class BaseAPITestCase(APITestCase):
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
        cls.owner = APIClient(name='Владелец')
        cls.admin = APIClient(name='Администратор')

        cls.user.force_authenticate(user)
        cls.owner.force_authenticate(owner)
        cls.admin.force_authenticate(admin)
        for client in (cls.anon, cls.user, cls.owner, cls.admin):
            client.name = client.defaults.get('name')
