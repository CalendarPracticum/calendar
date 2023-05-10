from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from api.v1.serializers.events import (
    CalendarSerializer,
    CategorySerializer,
    EventSerializer,
)
from api.v1.utils.events.filters import EventFilter
from api.v1.utils.events.mixins import RequiredGETQueryParamMixin
from events.models import Calendar, Category, Event


class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = CalendarSerializer
    pagination_class = None

    def perform_create(self, serializer):
        """
        При POST запросе на создание экземпляра модели Calendar
        поле owner автоматически заполняется текущим аутентифицированным
        пользователем.
        """

        serializer.save(owner=self.request.user)


class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = CategorySerializer
    pagination_class = None


class EventViewSet(RequiredGETQueryParamMixin, viewsets.ModelViewSet):
    queryset = Event.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = EventSerializer
    pagination_class = None
    filter_backends = (DjangoFilterBackend, )
    filterset_class = EventFilter
    required_query_params = ['datetime_start_after', 'datetime_start_before', ]

    def get_queryset(self):
        """
        Возвращает queryset объектов Event, отфильтрованный в зависимости от
        запрашиваемого юзера.

        Анонимный юзер получает ивенты из календаря админа (username = admin)

        Авторизованный пользователь ивенты из своего календаря
        и календаря админа.
        """

        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            return qs.filter(
                calendar__owner__username__in=[
                    'admin', self.request.user.username])
        return qs.filter(calendar__owner__username='admin')

from django.db.models import Q