from pong.models import ft_User
from django.http import HttpResponse
import json
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import translation
from django.http import JsonResponse
from .views_home import home_context
from django.views.i18n import JavaScriptCatalog


sections = {
	"": "pong/sections/index.html",
	"home": "pong/sections/home.html",
	"logout": "pong/sections/logout.html",
}

langs = {
	"en",
	"id",
	"es",
}

def set_lang_pref(request):
	if request.method == 'POST':

		body = json.loads(request.body)
		lang = body['lang']
		save = body['save']
		path = body['path']
		path_split = path.split("/")
		data = {}
		template = sections.get(path_split[1])
		if lang not in langs:
			return HttpResponse('error: language not supported')
		translation.activate(lang)
		if save == True:
			ft_User.objects.filter(id=request.user.id).update(language_preference=lang)
		if template:
			if template == "pong/sections/home.html":
				data['app'] = render_to_string(template, request=request, context=home_context(request))
			else:
				data['app'] = render_to_string(template, request=request)
		else:
			data['app'] = render_to_string(sections["home"], request=request)

		if path_split[1] == "" or path_split[1] == "logout":
			data['nav'] = ""
		else:
			data['nav'] = render_to_string("pong/components/navbar.html", request=request)
		response = JsonResponse(data)
		response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang)
		return response
	else:
		return HttpResponse('error', status=404)