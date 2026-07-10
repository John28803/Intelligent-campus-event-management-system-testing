import json

from django.contrib.admin.sites import AdminSite
from django.contrib.auth import get_user_model
from django.contrib.messages.storage.fallback import FallbackStorage
from django.test import RequestFactory, TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .admin import OrganizerInviteCodeAdmin, generate_invite_code_action
from .models import OrganizerInviteCode

User = get_user_model()


class OrganizerInviteCodeAdminActionTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.site = AdminSite()
        self.admin = OrganizerInviteCodeAdmin(OrganizerInviteCode, self.site)

    def test_generate_invite_code_action_creates_new_code(self):
        request = self.factory.get('/')
        request.session = {}
        setattr(request, '_messages', FallbackStorage(request))

        queryset = OrganizerInviteCode.objects.all()
        generate_invite_code_action(self.admin, request, queryset)

        self.assertEqual(OrganizerInviteCode.objects.count(), 1)
        created_code = OrganizerInviteCode.objects.get()
        self.assertFalse(created_code.used)
        self.assertTrue(created_code.code)


class FrontendApiCompatibilityTests(TestCase):
    def test_register_endpoint_supports_short_frontend_route_for_organizers(self):
        self.client = APIClient()
        invite = OrganizerInviteCode.objects.create(code='frontend-invite')
        payload = {
            'username': 'organizer1',
            'email': 'organizer@example.com',
            'password': 'StrongPassword123!',
            'role': 'organizer',
            'invite_code': invite.code,
        }

        response = self.client.post(
            '/api/register/',
            data=json.dumps(payload),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(User.objects.filter(username='organizer1').exists())
        invite.refresh_from_db()
        self.assertTrue(invite.used)

    def test_invite_code_generation_endpoint_supports_short_frontend_route(self):
        self.client = APIClient()
        admin_user = User.objects.create_superuser(
            username='admin-api',
            email='admin-api@example.com',
            password='StrongPassword123!',
            role='admin',
        )
        refresh = RefreshToken.for_user(admin_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

        response = self.client.post('/api/admin/invite-codes/')

        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(OrganizerInviteCode.objects.count(), 1)
