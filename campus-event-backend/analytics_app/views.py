from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from events.models import Event

from .services import (
    predict_event_attendance
)
class PredictionView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        event_id
    ):

        event = Event.objects.get(
            id=event_id
        )

        prediction = (
            predict_event_attendance(
                event
            )
        )

        return Response({
            "event": event.title,
            "capacity": event.capacity,
            "predicted_attendance":
            prediction
        })
    