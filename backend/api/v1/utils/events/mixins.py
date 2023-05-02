"""
Миксины для приложения 'events'
"""

from rest_framework.exceptions import ParseError


class RequiredGETQueryParamMixin:
    """
    Mixin для фильтрации;
    проверяет переданы ли обязательные параметры в GET запрос
    для отображения queryset.
    """

    required_query_params = []

    def initial(self, request, *args, **kwargs):
        """
        Переопределяем метод initial, который вызывается при инициализации
        представления.

        Метод проверяет что значения, указанные в списке required_query_params
        будут обязательно переданы в параметре GET запроса.
        """

        if self.request.method == 'GET' and self.action == 'list':
            for query_param in self.required_query_params:
                if not self.request.query_params.get(query_param):
                    raise ParseError(
                        f"Query parameter '{query_param}' is required")
        super().initial(request, *args, **kwargs)
