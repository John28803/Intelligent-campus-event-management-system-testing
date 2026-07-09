from django.test import SimpleTestCase

from recommendations import services


class RecommendationServiceFallbackTests(SimpleTestCase):
    def test_calculate_text_similarity_scores_without_sklearn(self):
        profile_text = "music tech"
        event_texts = ["music festival", "tech meetup", "art exhibition"]

        scores = services.calculate_text_similarity_scores(profile_text, event_texts)

        self.assertEqual(len(scores), 3)
        self.assertGreater(scores[0], scores[2])
