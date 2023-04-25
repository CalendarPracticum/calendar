from django.core.validators import RegexValidator
from django.db import models
import datetime

from users.models import User


class Calendar(models.Model):
    """Календарь"""
    name = models.CharField('Название', max_length=100)
    description = models.TextField('Описание', null=True, blank=True)
    public = models.BooleanField('Публичный', default=False)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Календарь',
        related_name='calendars',
    )

    class Meta:
        verbose_name = 'Календарь'
        verbose_name_plural = 'Календари'

    def __str__(self):
        return self.name


class Category(models.Model):
    """Категория"""
    name = models.CharField('Название', max_length=100, unique=True)
    color = models.CharField(
        'Код цвета в формате HEX',
        max_length=7,
        unique=True,
        validators=[RegexValidator(
            regex='^[#a-f0-9]+$',
            message='Недопустимые символы в коде цвета!'
        )]
    )

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name


class Event(models.Model):
    """
    Событие. Отражает все элементы события, поля timestamp_start и finish
    принимают дату и время. поля iso_datetime_start и finish носят только
    информационный характер. Отображаются в филдах админки для удобного
    чтения даты и времени которую автоматически подтягивают и конвертируют из
    timestamp формата.

    """
    name = models.CharField(
        'Название',
        max_length=100,
        null=True,
        blank=True
    )
    description = models.TextField('Описание', null=True, blank=True)
    iso_datetime_start = models.DateTimeField(
        'Начало',
        null=True,
        blank=True,
        editable=False,
    )
    iso_datetime_finish = models.DateTimeField(
        'Конец',
        null=True,
        blank=True,
        editable=False,
    )
    timestamp_start = models.BigIntegerField(
        'Начало в timestamp формате',
        editable=True,
    )
    timestamp_finish = models.BigIntegerField(
        'Конец в timestamp формате',
        null=True,
        blank=True,
        editable=True,
    )
    day_off = models.BooleanField('Выходной', default=False)
    holiday = models.BooleanField('Праздник', default=False)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        verbose_name='Категория',
        related_name='events'
    )
    calendar = models.ForeignKey(
        Calendar,
        on_delete=models.CASCADE,
        verbose_name='Календарь',
        related_name='events',
    )

    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'События'

    def __str__(self):
        return str(self.normal_datetime_start)

    def save(self, *args, **kwargs):
        if self.timestamp_start:
            self.iso_datetime_start = datetime.datetime.fromtimestamp(
                self.timestamp_start).isoformat()
        if self.timestamp_finish:
            self.iso_datetime_finish = datetime.datetime.fromtimestamp(
                self.timestamp_finish).isoformat()
        super(Event, self).save(*args, **kwargs)
