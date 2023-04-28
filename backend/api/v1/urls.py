from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from api.v1.views.users import UsersViewSet

v1_router = DefaultRouter()
v1_router.register(r'users', UsersViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title='Calendar',
        default_version='v1',
        description='Product calendar',
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0),
            name='schema-redoc'),
    path('', include(v1_router.urls)),
    path('auth/', include('djoser.urls.jwt')),
]
