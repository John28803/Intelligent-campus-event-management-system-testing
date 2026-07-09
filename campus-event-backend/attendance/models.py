from django.db import models
import uuid
from users.models import User
from events.models import Event

class Attendance(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE
    )

    checked_in = models.BooleanField(default=False)

    check_in_time = models.DateTimeField(
        blank=True,
        null=True
    )

    qr_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"

 