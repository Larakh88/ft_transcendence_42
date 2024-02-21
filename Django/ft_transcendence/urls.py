"""
URL configuration for ft_transcendence project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns
from django.views.i18n import JavaScriptCatalog
from django.conf import settings
from django.conf.urls.static import static
from pong import views as pong_views

js_info_dict = {
	'domain': 'djangojs',
    'packages': ('pong'),
}

urlpatterns = [
    path('admin/', admin.site.urls),
	path('', include('pong.urls')),
    path('jsi18n/', JavaScriptCatalog.as_view(packages=['pong'], domain=['djangojs']), js_info_dict, name="javascript-catalog"),
]

