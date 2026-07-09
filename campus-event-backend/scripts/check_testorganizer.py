import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = 'testorganizer'
try:
    user = User.objects.get(username=username)
    print('FOUND')
    print('username:', user.username)
    print('email:', user.email)
    print('role:', getattr(user, 'role', 'N/A'))
    print('is_staff:', user.is_staff)
    print('is_superuser:', user.is_superuser)
    print('date_joined:', getattr(user, 'date_joined', 'N/A'))
    print('last_login:', getattr(user, 'last_login', 'N/A'))
except User.DoesNotExist:
    print('NOT_FOUND')
except Exception as e:
    print('ERROR:', e)
