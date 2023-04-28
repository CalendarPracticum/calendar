from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class UsersLimitPagination(PageNumberPagination):
    """
    Класс пагинации для пользователей.

    Определен параметр количества экземпляров на странице — 'limit'.
    Массив пользователей доступен по ключу 'users'.
    """

    page_size_query_param = 'limit'

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('users', data),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
        ]))
