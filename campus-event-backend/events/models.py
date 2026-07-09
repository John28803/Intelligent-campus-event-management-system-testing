from django.db import models
from users.models import User

class Event(models.Model):

    CATEGORY_CHOICES = (
        ('technology', 'Technology'),
        ('career', 'Career'),
        ('sports', 'Sports'),
        ('education', 'Education'),
    )

    title = models.CharField(max_length=255)

    description = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    venue = models.CharField(max_length=255)

    date = models.DateField()

    time = models.TimeField()

    capacity = models.IntegerField()

    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    tags = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    target_audience = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

class Registration(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE
    )

    registered_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = (
            'user',
            'event'
        )

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"

# (moved into Event class)