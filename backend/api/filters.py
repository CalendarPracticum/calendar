from django_filters import FilterSet, filters

from events.models import Event


class EventFilter(FilterSet):
    """
    Фильтр кверисета событий по полю calendar.
    Если параметр calendar не передан, то возвращается пустой кверисет.
    """

    calendar = filters.BaseInFilter(
        field_name='calendar__id',
        lookup_expr='in'
    )

    class Meta:
        model = Event
        fields = ('calendar',)

    def filter_queryset(self, queryset):
        if not self.request.GET.get('calendar'):
            return Event.objects.none()
        return super().filter_queryset(queryset)
