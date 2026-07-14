from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, OrganizerInviteCode


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get(self.username_field)
        if username and "@" in username:
            try:
                user = get_user_model().objects.get(email__iexact=username)
                attrs[self.username_field] = user.username
            except get_user_model().DoesNotExist:
                pass
        return super().validate(attrs)


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    invite_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    def validate_role(self, value):
        if value and str(value).lower() == "admin":
            raise serializers.ValidationError("Cannot register with role 'admin'. Contact an administrator.")
        return value

    def validate(self, data):
        role = str(data.get('role', 'student')).lower()
        invite_code = data.get('invite_code')

        if role == 'organizer':
            if not invite_code:
                raise serializers.ValidationError({
                    'invite_code': 'Organizer registration requires a valid invite code.'
                })

            try:
                invite = OrganizerInviteCode.objects.get(code=invite_code, used=False)
            except OrganizerInviteCode.DoesNotExist:
                raise serializers.ValidationError({
                    'invite_code': 'Invite code is invalid or already used.'
                })

            data['invite'] = invite

        return data

    class Meta:
        model = User

        fields = [
            'id',
            'username',
            'email',
            'password',
            'role',
            'department',
            'matric_number',
            'interests',
            'invite_code',
        ]

    def create(self, validated_data):
        requested_role = str(validated_data.get('role', 'student')).lower()
        if requested_role == 'admin':
            requested_role = 'student'

        invite = validated_data.pop('invite', None)
        validated_data.pop('invite_code', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=requested_role,
            department=validated_data.get('department'),
            matric_number=validated_data.get('matric_number'),
            interests=validated_data.get('interests')
        )

        if invite:
            invite.used = True
            invite.used_by = user
            invite.used_at = timezone.now()
            invite.save()

        return user