from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.db import models


class Calendar(models.Model):
    """
    Календарь.
    Содержит name - название,
    description - описание,
    public - является ли
    публичным (bool),
    owner - владелец календаря (имеет связь с моделью user one_to_many).
    """

    name = models.CharField(
        'Название',
        max_length=100
    )
    description = models.TextField(
        'Описание',
        null=True,
        blank=True
    )
    public = models.BooleanField(
        'Публичный',
        default=False
    )
    owner = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        verbose_name='Владелец',
        related_name='calendars',
    )

    class Meta:
        verbose_name = 'Календарь'
        verbose_name_plural = 'Календари'

    def __str__(self):
        return self.name


class Category(models.Model):
    """
    Категория.
    Содержит name - название категории и
    hex_color - цветовая схема категории.
    color дополнительно валедируется на предмет символов hex формата.
    """

    name = models.CharField(
        'Название',
        max_length=100,
        unique=True
    )
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
    Событие.
    Содержит поля name - название,
    description - описание,
    datetime_start - дата и время начала,
    datetime_finish - дата и время окончания,
    day_off - является ли выходным (bool),
    holiday - является ли праздничным (bool),
    связывается через связь one_to_many с моделью category и calendar.
    """

    name = models.CharField(
        'Название',
        max_length=100,
        null=True,
        blank=True
    )
    description = models.TextField(
        'Описание',
        null=True,
        blank=True
    )
    datetime_start = models.DateTimeField(
        'Начало',
    )
    datetime_finish = models.DateTimeField(
        'Конец',
    )
    day_off = models.BooleanField(
        'Выходной',
        default=False
    )
    holiday = models.BooleanField(
        'Праздник',
        default=False
    )
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
        return str(self.datetime_start)
