from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from events.models import Calendar, Event, ShareCalendar
from users.models import User


class CalendarSerializer(serializers.ModelSerializer):
    """
    Сериализатор календаря.
    Поле public исключено из выдачи.
    """

    owner = serializers.SlugRelatedField(read_only=True, slug_field='email')

    class Meta:
        model = Calendar
        fields = (
            'id',
            'name',
            'description',
            'owner',
            'color',
        )
        extra_kwargs = {
            'name':
                {'required': True, 'error_messages':
                    {'required': 'Не задано название календаря',
                     'null': 'Название не может быть null',
                     }
                 },
        }

    @transaction.atomic
    def create(self, validated_data):
        """
        При POST запросе на создание экземпляра модели Calendar
        поле owner автоматически заполняется текущим аутентифицированным
        пользователем.
        """

        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['owner'] = request.user
            return super().create(validated_data)
        raise serializers.ValidationError(
            'Пользователь не аутентифицирован.')


class ShortCalendarSerializer(serializers.ModelSerializer):
    """
    Сериализатор с укороченным представлением. Необходим для передачи в
    эвенте только необходимых данных, вложенным сериализатором.
    """

    class Meta:
        model = Calendar
        fields = (
            'id',
            'name',
            'color',
            'owner'
        )


class ReadEventSerializer(serializers.ModelSerializer):
    calendar = ShortCalendarSerializer(read_only=True)
    datetime_start = serializers.DateTimeField(format='%Y-%m-%dT%H:%M')
    datetime_finish = serializers.DateTimeField(format='%Y-%m-%dT%H:%M')

    class Meta:
        model = Event
        fields = (
            'id',
            'datetime_start',
            'datetime_finish',
            'all_day',
            'name',
            'description',
            'day_off',
            'holiday',
            'calendar',
        )


class WriteEventSerializer(serializers.ModelSerializer):
    """
    Сериализатор для записи данных.
    В extra_kwargs изменены стандартные ошибки DRF на кастомные.
    """

    class Meta:
        model = Event
        fields = (
            'id',
            'datetime_start',
            'datetime_finish',
            'all_day',
            'name',
            'description',
            'day_off',
            'holiday',
            'calendar',
        )
        extra_kwargs = {
            'datetime_start':
                {'required': True, 'error_messages':
                    {'required': 'Дата начала мероприятия отсутствует',
                     'invalid': 'Неправильный формат даты и времени',
                     'null': 'Дата начала мероприятия не может быть null',
                     }
                 },
            'datetime_finish':
                {'required': True, 'error_messages':
                    {'required': 'Дата завершения мероприятия отсутствует',
                     'invalid': 'Неправильный формат даты и времени',
                     'null': 'Дата завершения мероприятия не может быть null',
                     }
                 },
            'calendar':
                {'required': True, 'error_messages':
                    {'required': 'Не выбран календарь',
                     'invalid': 'Укажите id календаря',
                     'null': 'Календарь не может быть null',
                     }
                 },
        }

    def to_representation(self, instance):
        """
        Метод переопределяет сериализатор для отображения после
        успешного запроса на изменение данных
        """

        return ReadEventSerializer(
            instance=instance, context=self.context).data

    def create(self, validated_data):
        calendar = validated_data.get('calendar')
        user = self.context.get('request').user
        if user != calendar.owner:
            raise ValidationError(
                {'calendar': 'Можно использовать только свой календарь'}
            )

        keys = ('all_day', 'datetime_start', 'datetime_finish')
        all_day, start, finish = [validated_data.get(key) for key in keys]
        if all_day:
            validated_data['datetime_start'] = start.replace(
                hour=0, minute=0
            )
            validated_data['datetime_finish'] = finish.replace(
                hour=23, minute=59, second=59,
            )

        return super().create(validated_data)

    def validate(self, data):
        datatime_start = data.get('datetime_start')
        datetime_finish = data.get('datetime_finish')

        if datatime_start >= datetime_finish:
            message = 'Мероприятие не может начинаться после даты окончания.'
            raise serializers.ValidationError(message)

        return data


class ShareCalendarSerializer(serializers.ModelSerializer):
    """
    Сериализация данных шеринга календаря.
    Owner - владелец календаря.
    user (share_to) - пользователь которому предоставляется доступ.
    calendar - календарь, которым делится владелец.

    Создание:
    При создании записи в бд owner и calendar подставляются автоматически и
    являются текущим календарем и текущим пользователем.

    Валидация:
    1. owner != user
    2. Поля user и calendar уникальные
    3. calendar является календарем созданным owner'ом
    """
    owner = serializers.SlugRelatedField(read_only=True, slug_field='email')
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='email')
    calendar = serializers.SlugRelatedField(read_only=True, slug_field='name')

    class Meta:
        model = ShareCalendar
        fields = (
            'owner',
            'user',
            'calendar',
            'custom_name',
            'custom_color',
        )

    def validate(self, data):
        request = self.context.get('request')
        calendar_pk = request.parser_context.get('kwargs').get('pk')

        owner = request.user
        user = data.get('user')
        calendar = owner.calendars.filter(pk=calendar_pk)
        share = ShareCalendar.objects.filter(user=user, calendar=calendar_pk)

        if not calendar:
            raise ValidationError('Нельзя поделиться чужим календарем')
        if user == owner:
            raise ValidationError('Нельзя поделиться календарем с собой')
        if share.exists():
            raise ValidationError(
                'Вы уже поделились этим календарем с этим пользователем'
            )

        return data


class ReadOwnerShareCalendarSerializer(serializers.ModelSerializer):

    owner = serializers.SlugRelatedField(read_only=True, slug_field='email')
    user = serializers.SlugRelatedField(read_only=True, slug_field='email')
    calendar = serializers.SerializerMethodField()

    class Meta:
        model = ShareCalendar
        fields = (
            'owner',
            'user',
            'calendar'
        )

    @staticmethod
    def get_calendar(instance):
        calendar = instance.calendar
        return {
            'id': calendar.id,
            'name': calendar.name,
            'color': calendar.color,
        }


class ReadUserShareCalendarSerializer(ReadOwnerShareCalendarSerializer):

    class Meta:
        model = ShareCalendar
        fields = (
            'id',
            'owner',
            'user',
            'calendar',
            'custom_name',
            'custom_color',
        )
