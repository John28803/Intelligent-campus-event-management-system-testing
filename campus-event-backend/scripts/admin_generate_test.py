import os
import django

import sys

# Ensure project root is on sys.path so `config` settings module can be imported
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model

User = get_user_model()

# Ensure admin user exists
admin_user, created = User.objects.get_or_create(
    username='admin',
    defaults={'email': 'admin@test.com', 'role': 'admin', 'is_staff': True, 'is_superuser': True},
)
if created:
    admin_user.set_password('Admin@1234')
    admin_user.save()

client = Client()
logged_in = client.login(username='admin', password='Admin@1234')
print('logged_in:', logged_in)

# Call the new explicit generate URL. Provide HTTP_HOST to avoid DisallowedHost errors.
resp = client.get('/admin/users/organizerinvitecode/generate/', follow=True, HTTP_HOST='127.0.0.1')
print('status_code:', resp.status_code)

# Capture messages if available
if resp.context and 'messages' in resp.context:
    messages = list(resp.context['messages'])
    for m in messages:
        print('message:', m.level_tag, m.message)
else:
    print('No messages in response context; headers:')
    for k, v in resp.items():
        print(k+':', v)

# Print OrganizerInviteCode count and latest code
from users.models import OrganizerInviteCode
count = OrganizerInviteCode.objects.count()
print('OrganizerInviteCode count:', count)
if count:
    latest = OrganizerInviteCode.objects.latest('created_at')
    print('Latest code:', latest.code)

print('\nNow testing AJAX/JSON request')
resp2 = client.get('/admin/users/organizerinvitecode/generate/', follow=True, HTTP_HOST='127.0.0.1', HTTP_X_REQUESTED_WITH='XMLHttpRequest', HTTP_ACCEPT='application/json')
print('AJAX status_code:', resp2.status_code)
try:
    print('AJAX content:', resp2.json())
except Exception:
    print('AJAX raw content:', resp2.content)
