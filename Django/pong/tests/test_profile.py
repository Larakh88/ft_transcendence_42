from django.test import TestCase
from pong.views import *
from django.test import Client
from pong.models import ft_User

user = {
	"id": 1,
	"login": 'test',

}
class TestProfiles(TestCase):
	def setUp(self):
		self.request = Client().get('/home')
		self.request.session = Client().session
		self.user = ft_User.objects.create_new_intra_user(self.request, user)
		self.user.save()
		self.client = Client()
		self.client.force_login(self.user)
	def test_user_exists(self):
		response = self.client.get('/profile/test')
		self.assertEqual(response.status_code, 200)
		self.assertContains(response, self.user.display_name)
	def test_user_does_not_exist(self):
		response = self.client.get('/profile/test2')
		self.assertEqual(response.status_code, 404)