from django.urls import include, path

from .v1 import urls as v1_urls

urlpatterns = [
    path('', include(v1_urls)),
]
