from django.contrib.auth import get_user_model
from django.test import TestCase

from ..models import Calendar, Category, Event

User = get_user_model()


class ModelTests(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User.objects.create_user(
            username='test_user1',
            email='test@user1.com',
            password='test1234',
        )
        cls.calendar = Calendar.objects.create(
            name='Календарь auth_user1',
            description='Описание календаря auth_user1',
            owner=cls.user,
        )
        cls.category = Category.objects.create(
            name='Тестовая категория 1',
            color='#f02345',
        )
        cls.event = Event.objects.create(
            name='Мероприятие 1',
            description='Описание описание мероприятия 1',
            datetime_start='2023-05-02T09:49:12+00:00',
            datetime_finish='2023-05-02T15:00:00+00:00',
            day_off=True,
            holiday=True,
            category=cls.category,
            calendar=cls.calendar,

        )

    def test_models_have_correct_object_names(self):
        """Проверяем, что у моделей Event, Calendar, Category
        корректно работает __str__"""

        event = ModelTests.event
        calendar = ModelTests.calendar
        category = ModelTests.category
        expected_object_name = {
            self.event: event.datetime_start,
            self.calendar: calendar.name,
            self.category: category.name
        }
        for value, expected in expected_object_name.items():
            with self.subTest(value=value):
                self.assertEqual(
                    expected,
                    str(value),
                    'Ошибка в методе __str__',
                )

    def test_event_verbose_name(self):
        """Проверяем verbose_name в полях модели Event
        совпадает с ожидаемым."""

        event = ModelTests.event
        field_verbose = {
            'name': 'Название',
            'description': 'Описание',
            'datetime_start': 'Начало',
            'datetime_finish': 'Конец',
            'day_off': 'Выходной',
            'holiday': 'Праздник',
            'category': 'Категория',
            'calendar': 'Календарь',
        }
        for value, expected in field_verbose.items():
            with self.subTest(value=value):
                self.assertEqual(
                    event._meta.get_field(value).verbose_name,
                    expected,
                    'Ошибка в verbose_name',
                )

    def test_calendar_verbose_name(self):
        """Проверяем verbose_name в полях модели Calendar
        совпадает с ожидаемым."""

        calendar = ModelTests.calendar
        field_verbose = {
            'name': 'Название',
            'description': 'Описание',
            'public': 'Публичный',
            'owner': 'Владелец',
        }
        for value, expected in field_verbose.items():
            with self.subTest(value=value):
                self.assertEqual(
                    calendar._meta.get_field(value).verbose_name,
                    expected,
                    'Ошибка в verbose_name',
                )

    def test_category_verbose_name(self):
        """Проверяем verbose_name в полях модели Category
        совпадает с ожидаемым."""

        category = ModelTests.category
        field_verbose = {
            'name': 'Название',
            'color': 'Код цвета в формате HEX',

        }
        for value, expected in field_verbose.items():
            with self.subTest(value=value):
                self.assertEqual(
                    category._meta.get_field(value).verbose_name,
                    expected,
                    'Ошибка в verbose_name',
                )
