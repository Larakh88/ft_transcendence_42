from django.test import TestCase
# from django.contrib.auth.models import User
from pong.models import ft_User
from pong.views import *
from django.test import Client


user = {
	"id": 1,
	"login": 'test',
}
# Create your tests here.
class TestUser(TestCase):
	def setUp(self):
		request = Client().get('/home')
		request.session = Client().session
		ft_User.objects.create_new_intra_user(request, user)
	def test_user_exists(self):
		user = ft_User.objects.get(display_name='test')
		self.assertEqual(user.display_name, 'test')


# check routes for appropriate status codes : 200 - ok : 302 - temporary redirect
class TestViews(TestCase):
	def test_inddex(self):
		client = Client()
		response = client.get("/")
		self.assertTrue(response.status_code == 200)
	def test_home(self):
		client = Client()
		response = client.get('/home')
		self.assertTrue(response.status_code == 302)
	def test_game(self):
		client = Client()
		response = client.get('/game')
		self.assertTrue(response.status_code == 302)
	def test_logout(self):
		client = Client()
		response = client.get("/logout")
		self.assertTrue(response.status_code == 200)