from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from events.models import Calendar, Category, Event

from ..serializers.events import (
    CalendarSerializer,
    CategorySerializer,
    EventSerializer,
)


class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()
    permission_classes = AllowAny,  # FIXME Установить нужный пермишен
    serializer_class = CalendarSerializer
    pagination_class = None


class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.all()
    permission_classes = AllowAny,  # FIXME Установить нужный пермишен
    serializer_class = CategorySerializer
    pagination_class = None


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    permission_classes = AllowAny,  # FIXME Установить нужный пермишен
    serializer_class = EventSerializer
    pagination_class = None
