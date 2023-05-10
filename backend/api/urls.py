from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .v1 import urls as v1_urls

jwt_patterns = [
    path('create/', TokenObtainPairView.as_view(), name='jwt-create'),
    path('refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
    path('verify/', TokenVerifyView.as_view(), name='jwt-veryfy'),
]

urlpatterns = [
    path('v1/', include(v1_urls)),
    path('auth/', include(jwt_patterns)),
]
