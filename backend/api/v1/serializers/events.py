# import datetime

from rest_framework import serializers

from events.models import Calendar, Category, Event


"""
class UnixTimestampField(serializers.DateTimeField):
    def to_representation(self, value):
        # Преобразование даты и времени из формата ISO в объект datetime
        datetime_obj = value
        if isinstance(value, str):
            datetime_obj = datetime.datetime.fromisoformat(value)
        # Преобразование даты и времени в формат Unix timestamp
        return int(datetime_obj.timestamp())
"""


class CalendarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Calendar
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = (
            'id',
            'datetime_start',
            'datetime_finish',
            'name',
            'description',
            'day_off',
            'holiday',
            'category',
            'calendar',
        )
