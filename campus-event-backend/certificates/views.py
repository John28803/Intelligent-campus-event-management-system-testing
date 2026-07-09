import os

from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Certificate
from .utils import generate_hash
from .services import create_certificate_pdf

from attendance.models import Attendance

class GenerateCertificateView(
    APIView
):

    def post(
        self,
        request,
        attendance_id
    ):

        attendance = Attendance.objects.get(
            id=attendance_id
        )

        if not attendance.checked_in:

            return Response({
                "message":
                "Attendance not confirmed"
            })

        hash_value = generate_hash(
            attendance.user.username,
            attendance.event.title
        )

        certificate = Certificate.objects.create(

            user=attendance.user,

            event=attendance.event,

            verification_hash=
            hash_value

        )

        pdf_path = (
            f"media/certificates/"
            f"{certificate.id}.pdf"
        )

        create_certificate_pdf(

            pdf_path,

            attendance.user.username,

            attendance.event.title,

            hash_value

        )

        certificate.pdf_file = pdf_path

        certificate.save()

        return Response({

            "message":
            "Certificate Generated",

            "hash":
            hash_value

        })
    
class VerifyCertificateView(
    APIView
):

    def get(
        self,
        request,
        hash_value
    ):

        try:

            certificate = Certificate.objects.get(
                verification_hash=
                hash_value
            )

            return Response({

                "valid": True,

                "student":
                certificate.user.username,

                "event":
                certificate.event.title,

                "issued":
                certificate.issued_at

            })

        except Certificate.DoesNotExist:

            return Response({

                "valid": False

            })