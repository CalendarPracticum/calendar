from rest_framework.permissions import SAFE_METHODS, BasePermission


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
