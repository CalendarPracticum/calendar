from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from api.v1.views.events import CalendarViewSet, EventViewSet
from api.v1.views.users import UsersViewSet

v1_router = DefaultRouter()
v1_router.register(r'users', UsersViewSet)
v1_router.register('calendars', CalendarViewSet, basename='calendars')
v1_router.register('events', EventViewSet, basename='events')

urlpatterns = [
    path('', include(v1_router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'),
         name='docs'),
]
