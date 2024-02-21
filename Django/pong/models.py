from django.db import models
from .manager import IntraOauth2UserManager
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
# Create your models here.

LANGUAGE_CHOICES = [
    ('en', 'English'),
    ('id', 'Indonesian'),
    ('es', 'Spanish'),
]

def validate_file_size(value):
    limit = 2 * 1024 * 1024
    if value.size > limit:
        raise ValidationError('File size must be no more than 2 MB.')

def associate_session_with_user(request, user): # after login() that crate session add the sesion to ft_user
    s_key = request.session.session_key
    if not s_key:
        request.session.create()
    user.session_key = s_key
    user.save()

class ft_User(models.Model):
    objects = IntraOauth2UserManager()

    id = models.IntegerField(primary_key=True)
    session_key = models.CharField(blank=True, null=True, max_length=40)
    intra_name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    image = models.FileField(
        blank=True,
        null=True,
        default='avatar.svg',
        validators=[
            validate_file_size,
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'svg'])
        ])
    last_login = models.DateTimeField(null=True)
    language_preference = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="en")
    def is_authenticated(self,request):
        return True

class FriendRequest(models.Model):
    request_id = models.IntegerField(primary_key=True)
    user_id = models.ForeignKey(ft_User, on_delete=models.CASCADE, related_name='receiver_friend_request')
    sender_id = models.ForeignKey(ft_User, on_delete=models.CASCADE, related_name='sender_friend_request')
    request_status = models.BooleanField(default=False)

class Friends(models.Model):
    friendship_id = models.IntegerField(primary_key=True)
    user_id = models.ForeignKey(ft_User, on_delete=models.CASCADE, related_name='user_id')
    # on_delete=models.CASCADE: in case a User is deleted all his frienships are also delete
    friend_id = models.ForeignKey(ft_User, on_delete=models.CASCADE, related_name='friend_id')
    request_id = models.ForeignKey(FriendRequest, on_delete=models.CASCADE)
    class Meta:
        unique_together = ['user_id', 'friend_id']
    # this Meta class is used to make sure there are no duplicate friendships. This is a bi-directional friendship

class MatchHistory(models.Model):
    user_id = models.ForeignKey(ft_User, on_delete=models.CASCADE, related_name='match_user_id')
    opponent_alias = models.CharField(max_length=50)
    user_score = models.IntegerField()
    opponent_score = models.IntegerField()
    timestamp = models.DateField()
    game_result = models.BooleanField(default=False)
