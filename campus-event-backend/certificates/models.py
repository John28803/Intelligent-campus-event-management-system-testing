from django.db import models
from users.models import User
from events.models import Event

class Certificate(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE
    )

    verification_hash = models.CharField(
        max_length=255,
        unique=True
    )

    pdf_file = models.FileField(
        upload_to='certificates/',
        blank=True,
        null=True
    )

    issued_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.user.username}"
            f" - "
            f"{self.event.title}"
        )