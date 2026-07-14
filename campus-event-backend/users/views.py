from rest_framework import generics
from .serializers import RegisterSerializer, EmailOrUsernameTokenObtainPairSerializer
from .models import User
from .models import OrganizerInviteCode
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import secrets


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    """Public registration endpoint. Admin role is blocked by serializer validation."""

    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


@method_decorator(csrf_exempt, name='dispatch')
class CsrfExemptTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer


@method_decorator(csrf_exempt, name='dispatch')
class CsrfExemptTokenRefreshView(TokenRefreshView):
    pass


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "department": user.department,
        })


@api_view(["GET"]) 
@permission_classes([IsAuthenticated])
def admin_list_users(request):
    """Admin-only: list all users."""
    if request.user.role != "admin":
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.all().values("id", "username", "email", "role", "department")
    return Response(list(users))


class InviteCodeView(APIView):
    """Admin-only endpoint to list and create organizer invite codes."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

        codes = OrganizerInviteCode.objects.all().values('id', 'code', 'used', 'used_by_id', 'created_at', 'used_at')
        return Response(list(codes))

    def post(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

        # generate a secure token
        token = secrets.token_urlsafe(16)
        # ensure uniqueness
        while OrganizerInviteCode.objects.filter(code=token).exists():
            token = secrets.token_urlsafe(16)

        invite = OrganizerInviteCode.objects.create(code=token)
        return Response({"id": invite.id, "code": invite.code, "used": invite.used}, status=status.HTTP_201_CREATED)