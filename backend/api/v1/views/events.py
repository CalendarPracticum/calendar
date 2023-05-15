from datetime import datetime

from django.db.models import Q
from drf_spectacular.utils import extend_schema, extend_schema_view, \
    OpenApiParameter, OpenApiExample
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


@extend_schema(tags=['Календарь'])
@extend_schema_view(
    list=extend_schema(
        summary='Список всех календарей пользователя',
        description=' ',
    ),
    create=extend_schema(
        summary='Создание нового календаря',
        description=' '
    ),
    retrieve=extend_schema(
        summary='Детальная информация о календаре',
        description=' '
    ),
    update=extend_schema(
        summary='Полное обновление календаря',
        description=' '
    ),
    partial_update=extend_schema(
        summary='Частичное обновление информации о календаре',
        description=' '
    ),
    destroy=extend_schema(
        summary='Удаление календаря',
        description=' '
    ),
)
class CalendarViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrCalendarOwnerOrReadOnly,)
    serializer_class = CalendarSerializer
    pagination_class = None

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Calendar.objects.all()
        return Calendar.objects.filter(owner=self.request.user)


@extend_schema(tags=['Событие'])
@extend_schema_view(
    list=extend_schema(
        summary='Информация о мероприятиях за определенный промежуток времени',
        description='Принимает обязательные параметры фильтрации и отдает '
                    'список мероприятий. Если пользователь не авторизован '
                    'то он получает мероприятия только из базового '
                    'календарь. Если авторизован то и все мероприятия '
                    'календарей пользователя.',
        parameters=[
            OpenApiParameter(
                'start_dt',
                datetime,
                description='Дата начала фильтрации: 2023-01-01T00:00:00',
                required=True,
            ),
            OpenApiParameter(
                'finish_dt',
                datetime,
                description='Дата окончания фильтрации: 2023-12-31T00:00:00',
                required=True,)
        ]
    ),
    create=extend_schema(
        summary='Создание нового события',
        description=' ',
        responses={201: ReadEventSerializer},
    ),
    retrieve=extend_schema(
        summary='Детальная информация о событии',
        description=' '
    ),
    update=extend_schema(
        summary='Полное обновление события',
        description=' ',
        responses={200: ReadEventSerializer},
    ),
    partial_update=extend_schema(
        summary='Частичное обновление информации о событии',
        description=' ',
        responses={200: ReadEventSerializer},
    ),
    destroy=extend_schema(
        summary='Удаление события',
        description=' '
    ),
)
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
