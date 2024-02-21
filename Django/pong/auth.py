from django.contrib.auth.backends import BaseBackend
from .models import ft_User

class ft_UserBackend(BaseBackend):
    def authenticate(self, request, user) -> ft_User:
        s = request.session.session_key
        user_find = ft_User.objects.filter(id=user['id'])
        if len(user_find) == 0:
            new_user = ft_User.objects.create_new_intra_user(request, user)
            return new_user
        return user_find
    
    def get_user(self, user_id):
        try:
            return ft_User.objects.get(pk=user_id)
        except ft_User.DoesNotExist:
            return None
        