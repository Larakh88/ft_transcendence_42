from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from pong.models import ft_User, Friends
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q

@login_required(login_url="/")
def update_users(request):
	if request.method == "GET":
		profile_user = request.user
		friendships = Friends.objects.filter(Q(user_id=profile_user) | Q(friend_id=request.user))
		friendships_list = []
		for friendship in friendships:
			friend = friendship.user_id if friendship.friend_id == profile_user else friendship.friend_id
			friend_data = {
                'display_name': friend.display_name,
                'friendship_id': friendship.friendship_id,
                'avatar_url': friend.image.url,
            }
			friendships_list.append(friend_data)
		if friendships_list:
			translations = {
				'playerAvatar': _('Player Avatar'),
                'viewPlayerProfile': _('View Player Profile'),
				'Unfriend': _('Unfriend'),
			}
			friendships_list_json = json.dumps(friendships_list, cls=DjangoJSONEncoder)
			context = {'friendships': friendships_list_json, 'translations': translations}
			return JsonResponse(context)
		else:
			return JsonResponse({'error': _('User has no friends!')}, status=404)
	return JsonResponse({'error': 'Invalid request method'}, status=400)
		