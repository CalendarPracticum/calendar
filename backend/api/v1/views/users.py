from django.contrib.auth import get_user_model
from djoser.views import UserViewSet

from api.v1.serializers.users import UsersSerializer

User = get_user_model()


class UsersViewSet(UserViewSet):
    """
    Переопределенный вьюсет для работы с пользователями.
    """

    queryset = User.objects.all()
    serializer_class = UsersSerializer
