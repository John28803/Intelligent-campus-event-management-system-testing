from django.test import TestCase

from attendance.models import Attendance
from events.models import Event
from recommendations import services
from users.models import User


class RecommendationServiceTests(TestCase):
    def test_calculate_text_similarity_scores_without_sklearn(self):
        profile_text = "music tech"
        event_texts = ["music festival", "tech meetup", "art exhibition"]

        scores = services.calculate_text_similarity_scores(profile_text, event_texts)

        self.assertEqual(len(scores), 3)
        self.assertGreater(scores[0], scores[2])

    def test_generate_recommendations_requires_at_least_10_registrations(self):
        organizer = User.objects.create_user(
            username="organizer-recs",
            email="organizer-recs@example.com",
            password="pass1234",
            role="organizer",
        )
        student = User.objects.create_user(
            username="student-recs",
            email="student-recs@example.com",
            password="pass1234",
            role="student",
        )

        for i in range(9):
            event = Event.objects.create(
                title=f"Event {i}",
                description="A test event",
                category="technology",
                venue="Hall",
                date="2026-01-01",
                time="10:00:00",
                capacity=100,
                organizer=organizer,
            )
            Attendance.objects.create(user=student, event=event)

        recommendations = services.generate_recommendations(student)
        self.assertEqual(recommendations, [])

    def test_generate_recommendations_excludes_registered_events(self):
        organizer = User.objects.create_user(
            username="organizer-recs2",
            email="organizer-recs2@example.com",
            password="pass1234",
            role="organizer",
        )
        student = User.objects.create_user(
            username="student-recs2",
            email="student-recs2@example.com",
            password="pass1234",
            role="student",
        )

        for i in range(10):
            event = Event.objects.create(
                title=f"Registered {i}",
                description="A registered event",
                category="career",
                venue="Hall",
                date="2026-01-01",
                time="10:00:00",
                capacity=100,
                organizer=organizer,
            )
            Attendance.objects.create(user=student, event=event)

        extra_event = Event.objects.create(
            title="Extra Event",
            description="An event not yet registered",
            category="education",
            venue="Room 101",
            date="2026-02-01",
            time="12:00:00",
            capacity=100,
            organizer=organizer,
        )

        recommendations = services.generate_recommendations(student)
        recommended_event_ids = [event.id for event, _ in recommendations]

        self.assertIn(extra_event.id, recommended_event_ids)
        for event_id in recommended_event_ids:
            self.assertNotIn(event_id, [e.id for e in Event.objects.filter(attendance__user=student)])
