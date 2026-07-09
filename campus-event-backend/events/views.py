from rest_framework import viewsets, serializers, permissions

from .models import Event, Registration
from .serializers import EventSerializer, RegistrationSerializer

from attendance.models import Attendance


class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        event = serializer.save(organizer=self.request.user)
        try:
            # lightweight logging to help debug create flows
            print(f"[events] Created Event id={event.id} title={event.title} organizer={self.request.user.id}")
        except Exception:
            pass


class RegistrationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Registration.objects.none()

        role = str(getattr(user, 'role', '')).lower()
        if role == 'organizer':
            return Registration.objects.filter(event__organizer=user)
        if role == 'admin' or user.is_staff:
            return Registration.objects.all()
        return Registration.objects.filter(user=user)

    def perform_create(self, serializer):
        event = serializer.validated_data.get('event')
        current = Registration.objects.filter(event=event).count()
        if event.capacity is not None and current >= event.capacity:
            raise serializers.ValidationError({'detail': 'Event is full'})

        registration = serializer.save(user=self.request.user)
        Attendance.objects.create(
            user=registration.user,
            event=registration.event
        )

    def perform_destroy(self, instance):
        Attendance.objects.filter(user=instance.user, event=instance.event).delete()
        instance.delete()