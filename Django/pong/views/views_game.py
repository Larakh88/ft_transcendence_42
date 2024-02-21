from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from pong.models import MatchHistory, ft_User
import json

@login_required(login_url="/")
def game(request):
    profile_user = request.user
    context = {'profile_user': profile_user,}
    if (request.headers.get('X-Custom-Header') != 'self'):
        return render(request, "pong/pages/gameSelection.html", context)

    return render(request, "pong/sections/game.html")

@login_required(login_url="/")
def multiGame(request):
    if (request.headers.get('X-Custom-Header') != 'self'):
        return render(request, "pong/pages/gameSelection.html")
        
    return render(request, "pong/sections/multiGame.html")

@login_required(login_url="/")
def gameSelection(request):
    profile_user = request.user
    context = {'profile_user': profile_user,}
    if (request.headers.get('X-Custom-Header') != 'self'):
        return render(request, "pong/pages/gameSelection.html", context)
    return render(request, "pong/sections/gameSelection.html", context)

@login_required(login_url="/")
def createMatch(request):
    user = get_object_or_404(ft_User, display_name=request.user.display_name)
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            opponent_alias = data.get('opponent_alias')
            user_score = data.get('user_score')
            opponent_score = data.get('opponent_score')
            timestamp = data.get('timestamp')
            game_result = data.get('game_result')

        except json.JSONDecodeError as e:
            return JsonResponse({'error': f'Invalid JSON data. Error: {e}'}, status=400)
        try:
            MatchHistory.objects.create(user_id=user,
            opponent_alias=opponent_alias,
            user_score=user_score,
            opponent_score=opponent_score,
            timestamp=timestamp,
            game_result=game_result)
        except Exception as e:
            return JsonResponse({'error': f'Match object could not be created! Error: {e}'}, status=500)
        return JsonResponse({'success': 'Match added'})
    return JsonResponse({'error': 'Invalid request'}, status=400)
