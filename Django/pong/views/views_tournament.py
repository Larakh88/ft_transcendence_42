from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url="/")
def tournamentForm(request):
    if request.method == "POST":
        return render(request, "pong/sections/tournamentDiagram.html")
    if request.headers.get("X-Custom-Header") != "self":
        return render(request, "pong/pages/tournamentForm.html")
    return render(request, "pong/sections/tournamentForm.html")


@login_required(login_url="/")
def tournamentDiagram(request):
    if request.headers.get("X-Custom-Header") != "self":
        return render(request, "pong/pages/tournamentDiagram.html")
    return render(request, "pong/sections/tournamentDiagram.html")
