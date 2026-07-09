from django.urls import path

from .views import (
    GenerateCertificateView,
    VerifyCertificateView
)

urlpatterns = [

    path(
        'generate/<int:attendance_id>/',
        GenerateCertificateView.as_view()
    ),

    path(
        'verify/<str:hash_value>/',
        VerifyCertificateView.as_view()
    ),

]