from datetime import datetime

from django.db.models import Q
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from api.permissions import (
    EventsOwnerOrAdminOrReadOnly,
    IsAuthenticatedOrCalendarOwnerOrReadOnly,
)
from api.v1.serializers.events import (
    CalendarSerializer,
    ReadEventSerializer,
    WriteEventSerializer,
)
from api.v1.utils.events.mixins import RequiredGETQueryParamMixin
from events.models import Calendar, Event


class CalendarViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrCalendarOwnerOrReadOnly,)
    serializer_class = CalendarSerializer
    pagination_class = None

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Calendar.objects.all()
        return Calendar.objects.filter(owner=self.request.user)


class EventViewSet(RequiredGETQueryParamMixin, viewsets.ModelViewSet):
    queryset = Event.objects.all()
    lookup_field = 'id'
    permission_classes = (EventsOwnerOrAdminOrReadOnly,)
    pagination_class = None
    required_query_params = ['start_dt', 'finish_dt', ]

    def get_queryset(self):
        """
        Возвращает queryset объектов Event, отфильтрованный в зависимости от
        дат переданных в параметрах запроса и запрашиваемого юзера.

        Юзер получает события которые происходят
        в диапазоне между переданными датами.

        Анонимный юзер получает ивенты из календаря админа (username = admin)

        Авторизованный пользователь ивенты из своего календаря
        и календаря админа.
        """
        if self.action == 'list':
            qs = super().get_queryset()

            # Проверка на правильность передаваемого формата даты в запрос.
            try:
                start = datetime.strptime(
                    self.request.query_params.get(
                        'start_dt'), '%Y-%m-%dT%H:%M:%S')
                finish = datetime.strptime(
                    self.request.query_params.get(
                        'finish_dt'), '%Y-%m-%dT%H:%M:%S')
            except ValueError:
                raise ValidationError(
                    'Invalid date format. '
                    'Please provide dates in the format YYYY-MM-DDTHH:MM:SS')

            # Исключаются события, которые начались позже,
            # либо закончились раньше
            # Переданного диапазона дат.
            qs = qs.exclude(
                Q(datetime_start__gt=finish) | Q(datetime_finish__lt=start))

            if self.request.user.is_authenticated:
                return qs.filter(
                    calendar__owner__username__in=[
                        'admin', self.request.user.username])
            return qs.filter(calendar__owner__username='admin')

        return Event.objects.filter(id=self.kwargs.get('id'))

    def get_serializer_class(self):
        """
        Метод определяет какой сериализатор использовать.
        При GET запросе данные отдаются в расширенном формате, а в остальных
        запрос используется сериализатор для записи данных
        """

        if self.request.method == 'GET':
            return ReadEventSerializer
        return WriteEventSerializer
