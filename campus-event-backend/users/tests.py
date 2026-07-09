from django.contrib.admin.sites import AdminSite
from django.contrib.messages.storage.fallback import FallbackStorage
from django.test import RequestFactory, TestCase

from .admin import OrganizerInviteCodeAdmin, generate_invite_code_action
from .models import OrganizerInviteCode


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
