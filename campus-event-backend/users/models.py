from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
        ('organizer', 'Organizer'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='student'
    )

    department = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    matric_number = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    interests = models.TextField(
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username


class OrganizerInviteCode(models.Model):
    code = models.CharField(max_length=64, unique=True)
    used = models.BooleanField(default=False)
    used_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='used_invite_codes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.code} {'(used)' if self.used else '(available)'}"
