from rest_framework.routers import DefaultRouter
from .views import EventViewSet, RegistrationViewSet

router = DefaultRouter()
router.register('', EventViewSet, basename='event')
router.register('registrations', RegistrationViewSet, basename='registration')

urlpatterns = router.urls