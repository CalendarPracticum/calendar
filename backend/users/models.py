from PIL import Image
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
    validate_email,
)
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    email = models.EmailField(
        'E-mail',
        unique=True,
        max_length=256,
        validators=(validate_email,)
    )
    username = models.CharField(
        'Имя пользователя',
        max_length=150,
        unique=True,
        validators=[UnicodeUsernameValidator],
    )
    profile_picture = models.ImageField(
        'Аватар',
        upload_to='profile_pictures',
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
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.profile_picture:
            img = Image.open(self.profile_picture.path)
            size = (128, 128)
            img.thumbnail(size)
            img.save(self.profile_picture.path)

    def __str__(self):
        return f'{self.username}'


@receiver(post_save, sender=User)
def create_user_settings(instance, created, **kwargs):
    if created:
        SettingsUser.objects.create(user=instance)


class SettingsUser(models.Model):
    user = models.OneToOneField(
        User,
        verbose_name='Пользователь',
        on_delete=models.CASCADE,
        related_name='settings'
    )
    dark_mode = models.BooleanField(
        'Темная тема',
        default=False
    )
    background = models.ImageField(
        'Фон',
        upload_to='backgrounds',
        null=True
    )

    class Meta:
        verbose_name = verbose_name_plural = 'Настройки пользователя'

    def __str__(self):
        return f'Настройки пользователя {self.user.username}'
