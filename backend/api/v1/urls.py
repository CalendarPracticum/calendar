from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.v1.views.users import UsersViewSet
from backend.api.v1.views.events import (
    CalendarViewSet,
    CategoryViewSet,
    EventViewSet,
)

v1_router = DefaultRouter()
v1_router.register(r'users', UsersViewSet)
v1_router.register('calendars', CalendarViewSet, basename='calendars')
v1_router.register('categories', CategoryViewSet, basename='categories')
v1_router.register('events', EventViewSet, basename='events')


urlpatterns = [
    path('', include(v1_router.urls)),
    path('auth/', include('djoser.urls.jwt')),
]
