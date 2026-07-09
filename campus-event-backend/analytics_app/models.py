from django.db import models
from events.models import Event

class AttendancePrediction(models.Model):

    event = models.OneToOneField(
        Event,
        on_delete=models.CASCADE
    )

    predicted_attendance = models.IntegerField()

    generated_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.event.title