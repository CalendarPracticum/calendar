from django.db import transaction
from rest_framework import serializers

from events.models import Calendar, Category, Event


class CalendarSerializer(serializers.ModelSerializer):

    owner = serializers.SlugRelatedField(read_only=True, slug_field='email')

    class Meta:
        model = Calendar
        fields = (
            'id',
            'name',
            'description',
            'public',
            'owner',
        )

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
