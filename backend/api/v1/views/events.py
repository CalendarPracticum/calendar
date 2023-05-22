from datetime import datetime

from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    OpenApiParameter,
    extend_schema,
    extend_schema_view,
)
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from api.filters import EventFilter
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
                    'календарей пользователя. Незначащие нули необязательны.',
        parameters=[
            OpenApiParameter(
                'start_dt',
                datetime,
                description='Дата начала фильтрации: 2023-01-01',
                required=True,
            ),
            OpenApiParameter(
                'finish_dt',
                datetime,
                description='Дата окончания фильтрации: 2023-12-31',
                required=True,),
            OpenApiParameter(
                'calendar',
                int,
                description='Несколько значений могут быть разделены запятыми',
            )
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
    permission_classes = (EventsOwnerOrAdminOrReadOnly,)
    pagination_class = None
    required_query_params = ['start_dt', 'finish_dt', ]
    filter_backends = (DjangoFilterBackend,)

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
            self.filterset_class = EventFilter
            qs = super().get_queryset()

            # Проверка на правильность передаваемого формата даты в запрос.
            try:
                start = datetime.strptime(
                    self.request.query_params.get(
                        'start_dt'), '%Y-%m-%d')
                finish = datetime.strptime(
                    self.request.query_params.get(
                        'finish_dt'), '%Y-%m-%d')
            except ValueError:
                raise ValidationError(
                    'Неправильный формат даты. '
                    'Пожалуйста, укажите дату в формате YYYY-MM-DD')

            if start >= finish:
                raise ValidationError(
                    'Начальная дата не может быть больше конечной'
                )

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

        return super().get_queryset()

    def get_serializer_class(self):
        """
        Метод определяет какой сериализатор использовать.
        При GET запросе данные отдаются в расширенном формате, а в остальных
        запрос используется сериализатор для записи данных
        """

        if self.request.method == 'GET':
            return ReadEventSerializer
        return WriteEventSerializer
