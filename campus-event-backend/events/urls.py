from rest_framework.routers import DefaultRouter
from .views import EventViewSet, RegistrationViewSet

router = DefaultRouter()
router.register('registrations', RegistrationViewSet, basename='registration')
router.register('', EventViewSet, basename='event')

urlpatterns = router.urls