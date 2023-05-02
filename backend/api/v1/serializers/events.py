from rest_framework import serializers

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
