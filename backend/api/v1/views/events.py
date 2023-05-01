from django_filters import rest_framework as drf_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets
from rest_framework.exceptions import ParseError
from rest_framework.permissions import AllowAny

from events.models import Calendar, Category, Event

from ..serializers.events import (
    CalendarSerializer,
    CategorySerializer,
    EventSerializer,
)


class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()
    permission_classes = AllowAny,  # FIXME Установить нужный пермишен
    serializer_class = CalendarSerializer
    pagination_class = None


class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.all()
    permission_classes = AllowAny,  # FIXME Установить нужный пермишен
    serializer_class = CategorySerializer
    pagination_class = None


class RequiredQueryParamMixin:
    """
    Mixin для фильтрации, чтобы обязательные параметры были включены в запрос.
    """

    required_query_params = []

    def initial(self, request, *args, **kwargs):
        """Переопределяем метод initial, который вызывается при инициализации
        представления.

        Метод проверяет что значения, указанные в списке required_query_params
        будут обязательно переданы в параметре запроса.
        """

        for query_param in self.required_query_params:
            if not self.request.query_params.get(query_param):
                raise ParseError(
                    f"Query parameter '{query_param}' is required")
        super().initial(request, *args, **kwargs)


class EventFilter(drf_filters.FilterSet):
    """
    Фильтр позволяет производить поиск событий, начинающихся в заданный
    период времени.

    Фильтр применяется к полю datetime_start модели Event.
    """

    datetime_start = drf_filters.DateTimeFromToRangeFilter()

    class Meta:
        model = Event
        fields = ('datetime_start', )


class EventViewSet(RequiredQueryParamMixin, viewsets.ModelViewSet):
    queryset = Event.objects.all()
    permission_classes = AllowAny,  # FIXME Установить нужный пермишен
    serializer_class = EventSerializer
    pagination_class = None
    filter_backends = (DjangoFilterBackend, )
    filterset_class = EventFilter
    required_query_params = ['datetime_start_after', 'datetime_start_before', ]

    def get_queryset(self):
        """
        Возвращает queryset объектов Event, отфильтрованный в зависимости от
        запрашиваемого юзера.

        Анонимный юзер получает ивенты из календаря админа (user id = 1)

        Авторизованный пользователь ивенты из своего календаря
        и календаря админа.
        """

        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            return qs.filter(calendar__owner__in=[1, self.request.user])
        return qs.filter(calendar__owner=1)
