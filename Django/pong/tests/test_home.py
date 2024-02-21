from django.test import TestCase
from pong.views import *
from django.test import Client
from pong.models import ft_User

user = {
	"id": 1,
	"login": 'test',
}

user2 = {
	"id": 2,
	"login": 'test2',
}
class TestHome(TestCase):
	def setUp(self):
		self.client = Client()
		self.request = Client().get('/home')
		self.request.session = Client().session
		self.user = ft_User.objects.create_new_intra_user(self.request, user)
		self.user.save()
		self.client.force_login(self.user)
	def test_username_in_home(self):
		response = self.client.get('/home')
		self.assertEqual(response.status_code, 200)
		self.assertContains(response, self.user.display_name)
	def test_new_username(self):
		data = {
			'newUsername': 'test2',
		}
		response = self.client.post('/updateUsername', data)
		self.assertEqual(response.status_code, 200)
	def test_new_username_exits(self):
		new_user = ft_User.objects.create_new_intra_user(self.request, user2)
		data = {
			'newUsername': 'test2',
		}
		response = self.client.post('/updateUsername', data)
		self.assertNotEqual(response.status_code, 200)
	def test_username_long(self):
		data = {
			'newUsername': 'testtesttesttestestesttestesttesttesttestetsttestestestetetsetestestsetsetsetstesttesttesttesttestttesttesttestsetstettesttstesttetstestsetstetsettesttestetstestetsetstsetestsetstetstettestestsetestestsetsetsetttetstestsettteststeststestset'
			}
		response = self.client.post('/updateUsername', data)
		self.assertNotEqual(response.status_code, 200)
	def test_empty_username(self):
		data = {
			'newUsername': '',
		}
		response = self.client.post('/updateUsername', data)
		self.assertNotEqual(response.status_code, 200)