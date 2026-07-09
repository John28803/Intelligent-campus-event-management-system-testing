from django.urls import path
from .views import QRTokenView
from .views import CheckInView

urlpatterns = [

    path(
        'qr/<int:attendance_id>/',
        QRTokenView.as_view()
    ),
    
    path(
    'checkin/',
    CheckInView.as_view()
),

]