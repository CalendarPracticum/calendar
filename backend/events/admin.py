from django.contrib import admin
from django.utils.html import format_html

from events.models import Calendar, Event


@admin.register(Calendar)
class CalendarAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'description',
        'public',
        'owner',
        'hex_color',
    )
    empty_value_display = '-пусто-'

    @staticmethod
    def hex_color(obj) -> format_html:
        """
        Метод берет цвет в hex формате из модели поля color и окрашивает
        строку в админ панели с цветом в соответствующий цвет.
        В админ панель выводится уже измененное поле hex_color.
        """
        return format_html(
            '<span style="color: {};">{}</span>',
            obj.color, obj.color
        )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'datetime_start',
        'datetime_finish',
        'name',
        'description',
        'day_off',
        'holiday',
        'calendar',
    )
    empty_value_display = '-пусто-'
