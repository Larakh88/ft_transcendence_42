from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from pong.models import ft_User, Friends, FriendRequest
from django.shortcuts import get_object_or_404, redirect, render
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q

@login_required(login_url="/")
def searchFriends(request):
    if request.method == "POST":
        friendName = request.POST.get('friendName')
        if len(friendName) > 0:
            friends = ft_User.objects.filter(display_name__icontains=friendName)
            friend_list = [{'display_name': friend.display_name, 'id': friend.id, 'avatar_url': friend.image.url} for friend in friends]
            if friend_list:
                translations = {
                    'playerAvatar': _('Player Avatar'),
                    'playerOnlineStatus': _('Player\'s Online Status'),
                    'viewPlayerProfile': _('View Player Profile'),
                    'sendFriendRequest': _('Send Friend Request'),
                }
                friend_list_json = json.dumps(friend_list, cls=DjangoJSONEncoder)
                context = {'friends': friend_list_json, 'translations': translations}
                return JsonResponse(context)
            else:
                return JsonResponse({'error': _('Could not find any users that match this username! Try again.')}, status=404)
        else:
            return JsonResponse({'error': _('Please enter a friend\'s username!')}, status=400)
    return JsonResponse({'error': _('Invalid request method')}, status=400)


@login_required(login_url="/")
def addFriend(request, friend_id):
    friend = get_object_or_404(ft_User, pk=friend_id)

    if request.method == 'POST':

        if request.user == friend:
            return JsonResponse({'error': _('FriendRequest object could not be created!')})
        friend_requests = FriendRequest.objects.filter(Q(user_id=request.user, sender_id=friend) | Q(user_id=friend, sender_id=request.user))
        if friend_requests.exists():
            for friend_request in friend_requests:
                if friend_request.request_status:
                    return JsonResponse({'no_action_true': _('Already a Friend!')})
            return JsonResponse({'no_action_false': _('Friend request exists, but not accepted yet.')})
        try:
            latest_friend_request_id = FriendRequest.objects.latest("request_id")
            new_friend_request_id = latest_friend_request_id.request_id + 1
        except FriendRequest.DoesNotExist:
            new_friend_request_id = 1

        try: 
            FriendRequest.objects.create(request_id=new_friend_request_id, user_id=friend, sender_id=request.user)
        except Exception as e:
            return JsonResponse({'error': _('FriendRequest object could not be created!')}, status=500)
        return JsonResponse({'success': _('Friend added')})

    return JsonResponse({'error': _('Invalid request method')}, status=400)


@login_required(login_url="/")
def acceptFriend(request, request_id):
    friend_request = get_object_or_404(FriendRequest, pk=request_id)

    if request.method == 'POST':
        friend_request.request_status = True
        friend_request.save()

        try:
            latest_friendship = Friends.objects.latest("friendship_id")
            new_friendship_id = latest_friendship.friendship_id + 1
        except Friends.DoesNotExist:
            new_friendship_id = 1

        try: 
            Friends.objects.create(friendship_id=new_friendship_id, user_id=request.user, friend_id=friend_request.sender_id, request_id=friend_request)
        except Exception as e:
            return JsonResponse({'error': _('Error accepting friend request!')}, status=500)
        return JsonResponse({'success': _('Friend request accepted')})

    return JsonResponse({'error': _('Invalid request method')}, status=400)


@login_required(login_url="/")
def rejectFriend(request, request_id):
    friend_request = get_object_or_404(FriendRequest, pk=request_id)
    requestId = friend_request.request_id

    if request.method == 'POST':

        try: 
            FriendRequest.objects.filter(request_id=requestId).delete()
        except Exception as e:
            return JsonResponse({'error': _('Error rejecting friend request!')}, status=500)
        return JsonResponse({'success': _('Friend request rejected')})

    return JsonResponse({'error': _('Invalid request method')}, status=400)


@login_required(login_url="/")
def unfriend (request, friendship_id):
    friendship = get_object_or_404(Friends, pk=friendship_id)

    if request.method == 'POST':
        try:
            request_id = friendship.request_id.request_id
            # if you delete the request, the friend is also deleted because request_id is a foreign key in friends.
            FriendRequest.objects.filter(request_id=request_id).delete()
        except Exception as e:
            return JsonResponse ({'error': _('Unfriend request unsuccessful')}, status=500)
        return JsonResponse({'success': _('Unfriend request successful')})

    return JsonResponse({'error': _('Invalid request method')}, status=400)

    

