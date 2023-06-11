from django.contrib.auth import get_user_model
from djoser.serializers import SetPasswordSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.v1.serializers.users import UsersCreateSerializer, UsersSerializer

User = get_user_model()


@extend_schema(tags=['Пользователь'])
@extend_schema_view(
    create=extend_schema(
        summary='Создание нового пользователя',
        description=' '
    ),
)
class UsersViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Вьюсет для работы с пользователями.

    Доступны запросы:
     - POST-запрос на /users/
     - GET/PATCH/DELETE-запросы на /users/me/
    """

    queryset = User.objects.all()
    serializer_class = UsersCreateSerializer
    permission_classes = (AllowAny,)

    @extend_schema(
        methods=['GET'],
        summary='Детальная информация о текущем пользователе',
        description=' ',
    )
    @extend_schema(
        methods=['PATCH'],
        summary='Частичное обновление информации о текущем пользователе',
        description=' ',
    )
    @extend_schema(
        methods=['DELETE'],
        summary='Удаление пользователя',
        description='**!!! В теле запроса обязательно нужно передать параметр '
                    '{"current_password": "user current password"} !!!**',
    )
    @action(
        ['get', 'patch', 'delete'],
        detail=False,
        permission_classes=[IsAuthenticated],
        serializer_class=UsersSerializer,
    )
    def me(self, request):
        """
        Реализация доступа к эндпойнту users/me/.

        Доступны GET, PATCH и DELETE запросы.
        Для DELETE-запроса требуется current_password.
        """

        match request.method:
            case 'GET':
                serializer = self.serializer_class(request.user)
                return Response(serializer.data, status=status.HTTP_200_OK)

            case 'PATCH':
                serializer = self.serializer_class(
                    request.user, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)

            case 'DELETE':
                password = request.data.get('current_password')
                if not password:
                    return Response(
                        data={'current_password': 'Требуется пароль'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                if not request.user.check_password(password):
                    return Response(
                        data={'current_password': 'Неверный пароль'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                request.user.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        return Response()

    @extend_schema(
        methods=['POST'],
        summary='Смена пароля пользователя',
        description=' ',
        responses={
            204: {}
        }
    )
    @action(
        ['post'],
        detail=False,
        permission_classes=[IsAuthenticated],
        serializer_class=SetPasswordSerializer,
    )
    def set_password(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
