from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    if (request.headers.get('X-Custom-Header') != 'self'):
        return render(request, "pong/pages/index.html")
    return render(request, "pong/sections/index.html")