from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from api.v1.serializers.events import (
    CalendarSerializer,
    CategorySerializer,
    EventSerializer,
)
from api.v1.utils.events.filters import EventFilter
from api.v1.utils.events.mixins import RequiredQueryParamMixin
from events.models import Calendar, Category, Event


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
