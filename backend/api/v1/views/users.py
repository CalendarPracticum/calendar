from django.contrib.auth import get_user_model
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from api.v1.serializers.users import UsersSerializer, UsersCreateSerializer

User = get_user_model()


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

    @action(
        ["get", "patch", "delete"],
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
        if request.method == 'GET':
            serializer = self.serializer_class(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PATCH':
            serializer = self.serializer_class(
                request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
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
