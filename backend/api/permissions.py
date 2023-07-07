from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from rest_framework.permissions import SAFE_METHODS, BasePermission

from events.models import Calendar, ShareCalendar


class IsAuthenticatedOrCalendarOwnerOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return (request.method in SAFE_METHODS and obj.public
                or request.user == obj.owner
                or request.user.is_superuser)


class EventsOwnerOrAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return (request.method in SAFE_METHODS and obj.calendar.public
                or request.user == obj.calendar.owner
                or request.user.is_superuser)


class ShareCalendarPermissions(BasePermission):
    def has_permission(self, request, view):
        calendar_pk = request.parser_context.get('kwargs').get('pk')
        if not calendar_pk.isdigit():
            raise NotFound()
        calendar = get_object_or_404(Calendar, pk=calendar_pk)
        users = ShareCalendar.objects.filter(
            calendar=calendar).values_list('user', flat=True)
        if request.method == 'PATCH' and request.user.id not in users:
            return False
        return request.user.id in users or calendar.owner == request.user
