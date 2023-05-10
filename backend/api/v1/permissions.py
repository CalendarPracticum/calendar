from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Создание календаря доступно только авторизованному пользователю.
    Редактирование календаря доступно только автору календаря.
    """

    message = 'У вас нет доступа к чужому контенту'

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
