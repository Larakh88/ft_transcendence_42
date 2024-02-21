from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest , JsonResponse
import requests, json
from django.db.models.query import QuerySet
from pong.models import ft_User
from django.conf import settings
import os

from pong.utils import is_active
from pong.models import associate_session_with_user

intra_login_url ="https://api.intra.42.fr/oauth/authorize?client_id=" + os.environ.get('FT_CLIENT_ID') + "&redirect_uri=https%3A%2F%2Flocalhost%3A8000%2Fintra_oauth2%2Flogin%2Fredirect&response_type=code"
def intra(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"user": "user" })

def signin(request):
    return render(request, 'pong/sections/index.html')

def intra_login(request):
    return redirect(intra_login_url)

def intra_redirect(request: HttpRequest):
    err = request.GET.get('error')
    if err:
        return redirect('/')
    code = request.GET.get('code')
    cre = exchange_code(code)
    authuser_query = authenticate(request, user=cre)
    if authuser_query is None: # new user
        authuser = ft_User.objects.create_new_intra_user(cre)
        login(request, authuser)
        return redirect('/home')
    elif authuser_query:
        authuser = authuser_query
        if isinstance(authuser , QuerySet):
            authuser = authuser[0]
        login(request, authuser)
        associate_session_with_user(request,authuser)
        is_active(authuser)
        response = redirect('/home')
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, authuser.language_preference)
        return response
    else:
        return HttpResponse("Authentication failed")


def exchange_code(code:str):
    data = {
        "client_id": os.environ.get("FT_CLIENT_ID"),
        "client_secret": os.environ.get("FT_SECRET"),
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": os.environ.get("FT_REDIRECT_URI"),
        "scope": "public",
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    response = requests.post("https://api.intra.42.fr/oauth/token", data=data, headers=headers)

    credentials = response.json()
    access_token = credentials['access_token']

    response = requests.get("https://api.intra.42.fr/v2/me", headers={
        'Authorization': 'Bearer %s' % access_token
    })
    user = response.json()
    return user

