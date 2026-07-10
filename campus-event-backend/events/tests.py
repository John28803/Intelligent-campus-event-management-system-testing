from django.test import TestCase
from rest_framework.test import APITestCase

from attendance.models import Attendance
from events.models import Event, Registration
from users.models import User


class RegistrationRouteTests(APITestCase):
    def test_registering_for_event_uses_registration_endpoint(self):
        organizer = User.objects.create_user(
            username='organizer-test',
            email='organizer-test@example.com',
            password='testpass123',
            role='organizer',
        )
        student = User.objects.create_user(
            username='student-test',
            email='student-test@example.com',
            password='testpass123',
            role='student',
        )
        event = Event.objects.create(
            title='Test Event',
            description='A test event',
            category='technology',
            venue='Main Hall',
            date='2025-01-01',
            time='10:00:00',
            capacity=10,
            organizer=organizer,
        )

        self.client.force_authenticate(student)
        response = self.client.post('/api/events/registrations/', {'event': event.id}, format='json')

        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(Registration.objects.filter(user=student, event=event).exists())
        self.assertTrue(Attendance.objects.filter(user=student, event=event).exists())
