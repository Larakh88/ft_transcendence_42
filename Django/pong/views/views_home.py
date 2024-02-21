from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from pong.models import ft_User, MatchHistory
from pong.utils import is_active

def home_context(request):
    users = ft_User.objects.all()
    profile_user = request.user
    is_user_active = is_active(profile_user)
    totalMatches = MatchHistory.objects.filter(user_id=profile_user).count()
    wins = MatchHistory.objects.filter(user_id=profile_user, game_result=True).count()
    loses = MatchHistory.objects.filter(user_id=profile_user, game_result=False).count()
    p_wins = round((wins / totalMatches) * 100) if totalMatches > 0 else 0
    p_loses = round((loses / totalMatches) * 100) if totalMatches > 0 else 0

    context = {'users': users,
    'profile_user': profile_user,
    'is_user_active': is_user_active,
    'totalMatches': totalMatches,
    'wins': wins,
    'loses': loses,
    'p_wins': p_wins,
    'p_loses': p_loses,
    }
    return context

@login_required(login_url="/")
def home(request):
    if request.headers.get('X-Custom-Header') == 'pop':
        data_dict = {}
        data_dict['app'] = render_to_string('pong/sections/home.html', request=request)
        data_dict['nav'] = render_to_string('pong/components/navbar.html', request=request)
        data_dict['title'] = render_to_string('pong/components/title.html')
        return JsonResponse(data_dict)
    context = home_context(request)
    if request.headers.get('X-Custom-Header') != 'self':
        return render(request, "pong/pages/home.html", context)
    return render(request, "pong/sections/home.html", context)