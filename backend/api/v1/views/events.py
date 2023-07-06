from datetime import datetime

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    OpenApiParameter,
    extend_schema,
    extend_schema_view,
)
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from api.filters import EventFilter
from api.permissions import (
    EventsOwnerOrAdminOrReadOnly,
    IsAuthenticatedOrCalendarOwnerOrReadOnly,
    ShareCalendarPermissions,
)
from api.v1.serializers.events import (
    CalendarSerializer,
    ReadEventSerializer,
    ReadOwnerShareCalendarSerializer,
    ReadUserShareCalendarSerializer,
    ShareCalendarSerializer,
    ShareCalendarUpdateSerializer,
    WriteEventSerializer,
)
from api.v1.utils.events.mixins import RequiredGETQueryParamMixin
from events.models import Calendar, Event, ShareCalendar

User = get_user_model()


@extend_schema(tags=['Календарь'])
@extend_schema_view(
    list=extend_schema(
        summary='Список всех календарей пользователя',
        description=' ',
    ),
    create=extend_schema(
        summary='Создание нового календаря',
        description=' ',
    ),
    retrieve=extend_schema(
        summary='Детальная информация о календаре',
        description=' ',
        parameters=[
            OpenApiParameter(
                name='id',
                type=int,
                location=OpenApiParameter.PATH,
                description='Идентификатор календаря',
            )
        ],
    ),
    update=extend_schema(
        summary='Полное обновление календаря',
        description=' ',
    ),
    partial_update=extend_schema(
        summary='Частичное обновление информации о календаре',
        description=' ',
    ),
    destroy=extend_schema(
        summary='Удаление календаря',
        description=' ',
    ),
    share=extend_schema(
        tags=['Шеринг календаря'],
    ),
    shared_to_me=extend_schema(
        tags=['Шеринг календаря'],
    ),
    shared_to_user=extend_schema(
        tags=['Шеринг календаря'],
    ),
)
@extend_schema(
    methods=['PUT', 'PATCH', 'DELETE'],
    parameters=[
        OpenApiParameter(
            name='id',
            type=int,
            location=OpenApiParameter.PATH,
            description='Идентификатор календаря',
        )
    ],
)
class CalendarViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrCalendarOwnerOrReadOnly,)
    pagination_class = None

    def get_queryset(self):
        if self.action == 'shared_to_me':
            return ShareCalendar.objects.filter(user=self.request.user)
        elif self.action == 'shared_to_user':
            return ShareCalendar.objects.filter(
                owner=self.request.user).distinct('calendar')
        return Calendar.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'share' and self.request.method == 'PATCH':
            return ShareCalendarUpdateSerializer
        elif self.action == 'share':
            return ShareCalendarSerializer
        elif self.action == 'shared_to_me':
            return ReadUserShareCalendarSerializer
        elif self.action == 'shared_to_user':
            return ReadOwnerShareCalendarSerializer
        return CalendarSerializer

    @extend_schema(
        methods=['POST'],
        summary='Поделиться календарем с пользователем.',
        parameters=[
            OpenApiParameter(
                name='id',
                type=int,
                location=OpenApiParameter.PATH,
                description='Идентификатор календаря',
            )
        ],
    )
    @extend_schema(
        methods=['DELETE'],
        summary='Удалить доступ к календарю, которым поделились.',
        description='⚠️ ️**В теле запроса обязательно нужно передать параметр '
                    '{"user": "user@example.com"}️** ⚠️',
    )
    @extend_schema(
        methods=['PATCH'],
        summary='Изменить цвет и название календаря подписчика.',
        responses=ShareCalendarSerializer()
    )
    @action(
        methods=['get', 'post', 'delete', 'patch'],
        detail=True,
        permission_classes=[ShareCalendarPermissions]
    )
    def share(self, request, pk):
        """
        Метод реализует функционал шаринга календаря.

        Доступные HTTP-методы:
         - POST — создание подписки. Необходимо передать email в теле запроса;
         - DELETE — удаление подписки;
         Если удаляет владелец календаря, то необходимо передать email
         подписчика в теле запроса.
         Если удаляет подписчик, то запрос отправляет без тела;
         - PATCH — метод для обновления полей custom_name и custom_color,
         для того, чтобы на фронте была возможность отрисовать название и цвет
         отличные от оригинальных полей календаря.
        """
        calendar = get_object_or_404(Calendar, pk=pk)
        serializer = self.get_serializer(data=request.data)

        if request.method == 'GET':
            share = ShareCalendar.objects.filter(calendar=calendar).first()
            serializer = ReadOwnerShareCalendarSerializer(share)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == 'POST':
            owner = request.user
            serializer.is_valid(raise_exception=True)
            serializer.save(owner=owner, calendar=calendar)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == 'DELETE':
            if request.user == calendar.owner:
                user = request.data.get('user')
                if user is None:
                    raise ValidationError({'user': 'Укажите пользователя'})
                owner = request.user
                try:
                    user = User.objects.get(email=user)
                except User.DoesNotExist:
                    raise ValidationError(
                        {'user': 'Пользователь не существует'}
                    )
            else:
                owner = calendar.owner
                user = request.user

            share = ShareCalendar.objects.filter(
                owner=owner, user=user, calendar=calendar)
            if share.exists():
                share.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(
                {'info': (f'Пользователь "{user}" еще не подписан на '
                          f'календарь "{calendar}"')},
                status=status.HTTP_400_BAD_REQUEST)

        if request.method == 'PATCH':
            instance = ShareCalendar.objects.get(
                owner=calendar.owner,
                user__email=request.user,
                calendar=calendar
            )

            serializer = self.get_serializer(
                instance,
                data=request.data,
                partial=True,
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        methods=['GET'],
        summary='Календари, которыми поделились с пользователем',
        responses=ReadUserShareCalendarSerializer,
    )
    @action(methods=['get'], detail=False)
    def shared_to_me(self, request):
        """Метод возвращает календари, которыми поделились с пользователем."""
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        methods=['GET'],
        summary='Календари, которыми владелец поделился с пользователями',
        responses=ReadOwnerShareCalendarSerializer()
    )
    @action(methods=['get'], detail=False)
    def shared_to_user(self, request):
        """Метод возвращает календари, которыми пользователь поделился."""
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
                required=True,
            ),
            OpenApiParameter(
                'calendar',
                str,
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

        qs = super().get_queryset()
        if self.action == 'list':
            self.filterset_class = EventFilter

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

            if start > finish:
                raise ValidationError(
                    'Начальная дата не может быть больше конечной'
                )

            # Исключаются события, которые начались позже,
            # либо закончились раньше
            # Переданного диапазона дат.
            qs = qs.exclude(
                Q(datetime_start__gt=finish) | Q(datetime_finish__lt=start))

            global_events = Q(calendar__owner__is_superuser=True,
                              calendar__public=True)
            if self.request.user.is_authenticated:
                return qs.filter(
                    Q(calendar__owner=self.request.user)
                    | Q(calendar__share_calendars__user=self.request.user)
                    | global_events
                )
            return qs.filter(global_events)

        return qs

    def get_serializer_class(self):
        """
        Метод определяет какой сериализатор использовать.
        При GET запросе данные отдаются в расширенном формате, а в остальных
        запрос используется сериализатор для записи данных
        """

        if self.request.method == 'GET':
            return ReadEventSerializer
        return WriteEventSerializer
