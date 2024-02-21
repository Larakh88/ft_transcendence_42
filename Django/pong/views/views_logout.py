from django.contrib.auth import logout
from django.contrib import messages
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _
from .views_home import home


def logout_view(request):
    logout(request)
    messages.success(request, _('Logged Out'), extra_tags='text-info')
    if (request.headers.get('X-Custom-Header') != 'self'):
        return render(request, 'pong/pages/logout.html')
    return render(request, 'pong/sections/logout.html')
