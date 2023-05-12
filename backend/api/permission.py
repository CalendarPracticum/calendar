from rest_framework import permissions


class CalendarOwnerOrReadOnly(permissions.BasePermission):
    """
    Доступ к list всем.
    Доступ к detail не авторизованному пользователю только к публичному
    календарю.
    Доступ к detail авторизованному пользователю к публичному календарю.
    Изменение объекта только владельцу.
    """

    message = 'Вы можете изменять только свой контент.'

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS and obj.calendar.public:
            return True
        return obj.calendar.owner == request.user
