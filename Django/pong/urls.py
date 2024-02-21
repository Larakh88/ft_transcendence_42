from django.urls import path
from . import views

app_name='pong'
urlpatterns = [
    path("", views.index, name="index"),
    path("home", views.home, name="home"),
	path("updateUsername", views.updateUsername, name="updateUsername"),
    path("updateAvatar", views.updateAvatar, name="updateAvatar"),
    path("game", views.game, name="game"),
    path("multiGame", views.multiGame, name="multiGame"),
    path("gameSelection", views.gameSelection, name="gameSelection"),
    path("createMatch", views.createMatch, name="createMatch"),
    path("signin", views.signin, name='signin'),
	path("logout", views.logout_view, name='logout'),
	path("profile/<str:pk>", views.profile, name="profile"),
	path("tournamentForm", views.tournamentForm, name='tournmanet form'),
	path("tournamentDiagram", views.tournamentDiagram, name='tournament diagram'),
    path("update_users", views.update_users, name="update_users"),
	path("searchFriends", views.searchFriends, name="searchFriends"),
    path('addFriend/<int:friend_id>/', views.addFriend, name='addFriend'),
    path('acceptFriend/<int:request_id>/', views.acceptFriend, name='acceptFriend'),
    path('rejectFriend/<int:request_id>/', views.rejectFriend, name='rejectFriend'),
    path('unfriend/<int:friendship_id>/', views.unfriend, name='unfriend'),
    path('intra_oauth2', views.intra , name='intra_oauth2'),
    path('intra_oauth2/login', views.intra_login , name='intra_login'),
    path('intra_oauth2/login/redirect', views.intra_redirect, name='intra_redirect'),
	path('set_language', views.set_lang_pref, name='set_language'),
]


