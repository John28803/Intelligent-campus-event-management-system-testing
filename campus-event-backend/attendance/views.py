from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Attendance

class QRTokenView(APIView):

    def get(self, request, attendance_id):

        attendance = Attendance.objects.get(
            id=attendance_id
        )

        return Response({
            "token":
            str(attendance.qr_token)
        })

from django.utils import timezone

class CheckInView(APIView):

    def post(self, request):

        token = request.data.get("token")

        try:

            attendance =Attendance.objects.get(qr_token=token)

            if attendance.checked_in:

                return Response({
                    "message":
                    "Already checked in"
                })

            attendance.checked_in = True

            attendance.check_in_time = (
                timezone.now()
            )

            attendance.save()

            return Response({
                "message":
                "Check-in successful"
            })

        except Attendance.DoesNotExist:

            return Response({
                "message":
                "Invalid QR Code"
            })