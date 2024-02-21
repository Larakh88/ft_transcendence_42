from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from pong.models import ft_User
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage

def validate_image_size(value):
    limit = 2 * 1024 * 1024 
    if value.size > limit:
        raise ValidationError(_('File size must be no more than 2 MB.'))

def validate_image_extension(value):
    valid_extensions = ['jpg', 'jpeg', 'png', 'svg']
    ext = value.name.split('.')[-1].lower()
    if ext not in valid_extensions:
        raise ValidationError(_('Invalid file extension. Allowed extensions are jpg, jpeg, png, svg.'))

@login_required(login_url="/")
def updateAvatar(request):
	if request.method == "POST":
		uploaded_file = request.FILES.get('file')

		if uploaded_file:
			try:
				validate_image_size(uploaded_file)
				validate_image_extension(uploaded_file)
			except ValidationError as e:
				return JsonResponse({'error': str(e)}, status=415)
			if request.user.image:
				if request.user.image.name != 'avatar.svg':
					request.user.image.delete()

			file_name = uploaded_file.name
			request.user.image.save(file_name, uploaded_file)
			name = request.user.image.name
			response_data = {
				'message': _('Avatar updated successfully'),
				'name': name
			}
			return JsonResponse(response_data)
		else:
			return JsonResponse({'error': _('No file was provided')}, status=400)

	return JsonResponse({'error': 'Invalid request method'}, status=400)
