from django.contrib import admin

from events.models import Calendar, Event, Category


@admin.register(Calendar)
class CalendarAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'public', 'owner')
    empty_value_display = '-пусто-'


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'iso_datetime_start',
        'iso_datetime_finish',
        'name',
        'description',
        'timestamp_start',
        'timestamp_finish',
        'day_off',
        'holiday',
        'category',
        'calendar',
    )
    empty_value_display = '-пусто-'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'color',
    )
    empty_value_display = '-пусто-'
