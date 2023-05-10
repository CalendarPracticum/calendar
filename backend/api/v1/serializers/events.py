from django.db import transaction
from rest_framework import serializers, status

from events.models import Calendar, Category, Event


class CalendarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Calendar
        fields = (
            'id',
            'name',
            'description',
            'public',
            'owner',
        )
        read_only_fields = ('owner', )

    @transaction.atomic
    def create(self, validated_data):
        """
        При POST запросе на создание экземпляра модели Calendar
        поле owner автоматически заполняется текущим аутентифицированным
        пользователем.
        """
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = (
            'id',
            'name',
            'color',
        )


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
