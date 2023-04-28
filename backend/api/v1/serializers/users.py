import base64

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers

from users.models import SettingsUser

User = get_user_model()


class Base64ImageField(serializers.ImageField):
    """
    Кастомное поле для преобразования bas64 в изображение.
    """

    def to_internal_value(self, data):
        """
        Принимает строку, закодированную в bas64.
        Если строка валидная, преобразовывает в изображение.
        """
        if isinstance(data, str) and data.startswith('data:image'):
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name='photo.' + ext)

        return super().to_internal_value(data)


class SettingsSerializer(serializers.ModelSerializer):
    """
    Сериализатор пользовательских настроек.
    """

    class Meta:
        model = SettingsUser
        fields = ('dark_mode', 'background')


class UsersCreateSerializer(UserCreateSerializer):
    """
    Сериализатор создания экземпляра пользователя.

    Поле settings — вложенный сериализатор, необязательное.
    Поле profile_picture — декодер из base64, необязательное.
    Поле password — в ответе не возвращается.
    """

    settings = SettingsSerializer(required=False)
    profile_picture = Base64ImageField(required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'password',
            'profile_picture',
            'settings',
        )


class UsersSerializer(UserSerializer):
    """
    Сериализатор получения/редактирования пользователя.

    Поле settings — вложенный сериализатор, необязательное.
    Поле profile_picture — декодер из base64, необязательное.
    """

    settings = SettingsSerializer(required=False)
    profile_picture = Base64ImageField(required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'profile_picture',
            'settings',
        )
