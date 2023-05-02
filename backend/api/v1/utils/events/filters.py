"""
Фильтры приложения 'events'
"""

from django_filters import rest_framework as drf_filters

from events.models import Event


class EventFilter(drf_filters.FilterSet):
    """
    Фильтр позволяет производить поиск событий, начинающихся в заданный
    период времени.

    Фильтр применяется к полю datetime_start модели Event.

    Фильтр автоматически добавляет к передаваемому параметру datetime_start
    суффиксы 'after' и 'before'.

    Пример запроса:

    api/v1/events/
    ?datetime_start_after=2023-01-12&datetime_start_before=2023-04-12T23:59:59Z

    В ответ будут переданы события (events)
    которые имеют datetime_start больше 2023-01-12 включительно,
    и datetime_start меньше 2023-04-12 23:59:59 включительно
    """

    datetime_start = drf_filters.DateTimeFromToRangeFilter()

    class Meta:
        model = Event
        fields = ('datetime_start', )
