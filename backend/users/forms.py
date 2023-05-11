from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class CustomUserChangeForm(UserChangeForm):
    username = forms.CharField(label=_('Username'), required=False)


class CustomUserCreationForm(UserCreationForm):
    username = forms.CharField(label=_('Username'), required=False)

    class Meta(UserCreationForm.Meta):
        model = User
