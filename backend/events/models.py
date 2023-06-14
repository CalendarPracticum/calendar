from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
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
    color = models.CharField(
        'Код цвета в формате HEX',
        max_length=7,
        validators=[RegexValidator(
            regex='^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$',
            message='Недопустимые символы в коде цвета!'
        )]
    )

    class Meta:
        verbose_name = 'Календарь'
        verbose_name_plural = 'Календари'

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
        max_length=300,
        null=True,
        blank=True
    )
    datetime_start = models.DateTimeField(
        'Начало',
    )
    datetime_finish = models.DateTimeField(
        'Конец',
    )
    all_day = models.BooleanField(
        'Длится весь день',
        default=False
    )
    day_off = models.BooleanField(
        'Выходной',
        default=False
    )
    holiday = models.BooleanField(
        'Праздник',
        default=False
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

    def clean(self):
        if self.datetime_start >= self.datetime_finish:
            message = 'Мероприятие не может начинаться после даты окончания.'
            raise ValidationError(message)


class ShareCalendar(models.Model):
    """
    Шеринг календаря владельцем, пользователю, который есть в базе.
    Owner - Владелец календаря.
    User - Пользователь которому открыт доступ.
    Calendar - календарь, которым поделился владелец.
    User и Calendar уникальные поля и не могут повторяться.
    """

    owner = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        verbose_name='Владелец',
        related_name='owner_of_calendars'
    )
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        verbose_name='Пользователь кому открыт доступ',
        related_name='share_to_user'
    )
    calendar = models.ForeignKey(
        Calendar,
        on_delete=models.CASCADE,
        verbose_name='Календарь',
        related_name='share_calendars',
    )
    custom_name = models.CharField(
        'Название',
        max_length=100,
        null=True,
        blank=True,
    )
    custom_color = models.CharField(
        'Код цвета в формате HEX',
        max_length=7,
        null=True,
        blank=True,
        validators=[RegexValidator(
            regex='^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$',
            message='Недопустимые символы в коде цвета!'
        )]
    )

    class Meta:
        verbose_name = 'Доступ к календарю'
        verbose_name_plural = 'Доступ к календарям'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'calendar'],
                name='unique_calendar_name',
                violation_error_message='Поля calendar и user должны '
                                        'быть уникальными.'
            )
        ]

    def __str__(self):
        return str(self.calendar)

    def clean(self):
        if self.owner == self.user:
            message = 'Нельзя поделиться календарем с самим собой.'
            raise ValidationError(message)
