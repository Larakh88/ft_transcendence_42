from django.contrib.auth import models

class IntraOauth2UserManager(models.UserManager):
    def create_new_intra_user(self, request, user):
        new_user= self.create(
            id=user['id'],
            intra_name=user['login'],
            display_name=user['login'],
            session_key = request.session.session_key,
        )
        return new_user
    