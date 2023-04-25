from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin


@admin.register(get_user_model())
class UserAdmin(UserAdmin):
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email", "username", "profile_picture", "hours",
                    "password1", "password2"
                ),
            },
        ),
    )
    fieldsets = UserAdmin.fieldsets + (
            (('Информация о профиле',
              {'fields': ('profile_picture', 'hours')}),)
    )
