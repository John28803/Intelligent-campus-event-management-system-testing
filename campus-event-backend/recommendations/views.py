from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services import generate_recommendations

class RecommendationView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        recommendations = (
            generate_recommendations(
                request.user
            )
        )

        result = []

        for event, score in recommendations:

            result.append({
                "id": event.id,
                "title": event.title,
                "category": event.category,
                "venue": event.venue,
                "score": round(
                    float(score),
                    3
                )
            })

        return Response(result)