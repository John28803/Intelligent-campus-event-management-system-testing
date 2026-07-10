from rest_framework import serializers
from .models import Event, Registration
from attendance.models import Attendance
import base64
import io


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ('organizer', 'created_at')


class RegistrationSerializer(serializers.ModelSerializer):
    qr_code = serializers.SerializerMethodField()
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.DateField(source='event.date', read_only=True)
    event_time = serializers.TimeField(source='event.time', read_only=True)
    checked_in = serializers.SerializerMethodField()

    class Meta:
        model = Registration
        fields = "__all__"
        read_only_fields = ('user', 'registered_at')

    def get_qr_code(self, obj):
        # Try to generate a PNG QR code for the attendance qr_token.
        try:
            import qrcode
        except Exception:
            # qrcode package not installed; return token so frontend can generate QR
            attendance = Attendance.objects.filter(user=obj.user, event=obj.event).first()
            return str(attendance.qr_token) if attendance else None

        attendance = Attendance.objects.filter(user=obj.user, event=obj.event).first()
        if not attendance:
            return None

        qr_value = str(attendance.qr_token)
        img = qrcode.make(qr_value)
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_b64 = base64.b64encode(buffered.getvalue()).decode()
        return f"data:image/png;base64,{img_b64}"

    def get_checked_in(self, obj):
        attendance = Attendance.objects.filter(user=obj.user, event=obj.event).first()
        return bool(attendance and attendance.checked_in)