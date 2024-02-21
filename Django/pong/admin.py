from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.ft_User)
admin.site.register(models.Friends)
admin.site.register(models.FriendRequest)
admin.site.register(models.MatchHistory)