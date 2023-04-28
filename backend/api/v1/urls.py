from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.v1.views.users import UsersViewSet

v1_router = DefaultRouter()
v1_router.register(r'users', UsersViewSet)


urlpatterns = [
    path('', include(v1_router.urls)),
    path('auth/', include('djoser.urls.jwt')),
]
