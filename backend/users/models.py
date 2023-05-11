import os

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import (
    MaxValueValidator,
    MinValueValidator,
    validate_email,
)
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.crypto import get_random_string
from PIL import Image

from users.managers import CustomUserManager


def change_filename(instance, filename):
    """
    Переименование файла при сохранении в 'pp_<user_id>.extension'
    """

    upload_to = 'profile_pictures'
    ext = filename.split('.')[-1]
    filename = f'pp_{get_random_string(7)}.{ext}'
    return os.path.join(upload_to, filename)


class User(AbstractUser):
    """
    Переопределенная модель пользователя для проекта.

    Поля электронной почты и имени пользователя обязательны и уникальны.
    Поля количества рабочих часов и аватара опциональны и
    имеют дефолтные значения.
    """

    email = models.EmailField(
        'E-mail',
        max_length=256,
        unique=True,
        validators=(validate_email,)
    )
    username = models.CharField(
        'Имя пользователя',
        max_length=150,
        unique=True,
        validators=[UnicodeUsernameValidator],
        blank=True,
        null=True,
    )
    profile_picture = models.ImageField(
        'Аватар',
        upload_to=change_filename,
        default=None,
        null=True,
    )
    hours = models.PositiveIntegerField(
        'Количество рабочих часов в неделю',
        default=40,
        validators=(
            MinValueValidator(1),
            MaxValueValidator(168),
        )
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ('id',)

    def save(self, *args, **kwargs):
        """
        Переопределенный метод сохранения экземпляра.

        При наличии аватара пользователя файл сжимается до размера 128*128.
        При обновлении аватара старый файл удаляется.
        """

        if self.pk:
            old_user = User.objects.get(pk=self.pk)
            if old_user.profile_picture and self.profile_picture and (
                    old_user.profile_picture != self.profile_picture):
                try:
                    os.remove(old_user.profile_picture.path)
                except FileNotFoundError:
                    pass

        super().save(*args, **kwargs)

        if self.profile_picture:
            img = Image.open(self.profile_picture.path)
            size = (128, 128)
            img.thumbnail(size)
            img.save(self.profile_picture.path)

    def __str__(self):
        return f'{self.username}'


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_settings(instance, created, **kwargs):
    """
    Сигнал при создании экземпляра пользователя создает экземпляр настроек.
    """

    if created:
        SettingsUser.objects.create(user=instance)


class SettingsUser(models.Model):
    """
    Модель пользовательских настроек.

    Хранит булевое значение о темной теме и поле с фоновым изображением.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        verbose_name='Пользователь',
        on_delete=models.CASCADE,
        related_name='settings',
    )
    dark_mode = models.BooleanField(
        'Темная тема',
        default=False,
    )
    background = models.ImageField(
        'Фон',
        upload_to='backgrounds',
        null=True,
    )

    class Meta:
        verbose_name = verbose_name_plural = 'Настройки пользователя'

    def __str__(self):
        return f'Настройки пользователя {self.user.username}'
