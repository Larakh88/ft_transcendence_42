from django.shortcuts import render, get_object_or_404
from pong.models import ft_User
from django.contrib.auth.decorators import login_required
from pong.utils import is_active

def profile_context(request, pk):
    profile_user = get_object_or_404(ft_User, display_name=pk)
    users = ft_User.objects.all()
    is_user_active = is_active(profile_user)
    context = {
        'profile_user': profile_user,
        'users': users, 'is_user_active': is_user_active,
        }
    return context

@login_required(login_url="/")
def profile(request, pk):
    context = profile_context(request, pk)
    if (request.headers.get('X-Custom-Header') != 'self'):
        return render(request, 'pong/pages/profile.html', context)
    return render (request, 'pong/sections/profile.html', context)