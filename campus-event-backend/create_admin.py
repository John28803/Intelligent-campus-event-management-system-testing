import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if admin user already exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@test.com',
        password='Admin@1234',
        role='admin'
    )
    print("Admin superuser created successfully")
else:
    print("Admin user already exists")
