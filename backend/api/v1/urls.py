from django.urls import include, path

from rest_framework.routers import DefaultRouter

v1_router = DefaultRouter()
# TODO Тут регистрируются новые url'ы


urlpatterns = [
    path('', include(v1_router.urls)),
]
