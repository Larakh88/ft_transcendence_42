from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from pong.models import ft_User

@login_required(login_url="/")
def updateUsername(request):
	if request.method == "POST":
		new_username = request.POST.get('newUsername')

		if len(new_username) > 20:
			return JsonResponse({'error': _('Username is too long!')}, status=400)
		if len(new_username) < 3:
			return JsonResponse({'error': _('Username is too short!')}, status=400)
		if not new_username:
			return JsonResponse({'error': _('Please type a new username.')}, status=400)
		if any(elem in new_username for elem in " !@#$%^&*()[]{};:,./<>?`~\\|"):
			return JsonResponse({'error': _('Username cannot include spaces or special characters')}, status=400)
		if ft_User.objects.filter(display_name=new_username).exists():
			return JsonResponse({'error': _('Username already exists.')}, status=400)
		if not any(digit.isdigit() for digit in new_username):
			return JsonResponse({'error': _('Username does not include a number.')}, status=400)
		try:
			request.user.display_name = new_username
		except:
			return JsonResponse({'error': _('Could not change username! Try again.')}, status=413)
		request.user.save()
		return JsonResponse({'message': _('Username updated successfully')})
	return JsonResponse({'error': 'Invalid request method'}, status=400)
