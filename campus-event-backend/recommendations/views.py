from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services import generate_recommendations

class RecommendationView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        recommendations = generate_recommendations(request.user)
        result = []

        for event, score in recommendations:
            result.append({
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "category": event.category,
                "venue": event.venue,
                "date": event.date,
                "time": event.time,
                "capacity": event.capacity,
                "tags": event.tags,
                "target_audience": event.target_audience,
                "score": round(float(score), 3),
            })

        return Response(result)