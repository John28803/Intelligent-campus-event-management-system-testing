from django.urls import path

from .views import PredictionView

urlpatterns = [

    path(
        'predict/<int:event_id>/',
        PredictionView.as_view()
    ),

]