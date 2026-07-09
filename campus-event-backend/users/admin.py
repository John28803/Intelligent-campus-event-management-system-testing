import secrets

from django.contrib import admin, messages
from django.urls import path
from django.shortcuts import redirect
from django.http import JsonResponse

from .models import User, OrganizerInviteCode


def generate_unique_invite_code():
    token = secrets.token_urlsafe(16)
    while OrganizerInviteCode.objects.filter(code=token).exists():
        token = secrets.token_urlsafe(16)
    return token


@admin.action(description='Generate organizer invite code')
def generate_invite_code_action(modeladmin, request, queryset):
    del queryset
    token = generate_unique_invite_code()
    OrganizerInviteCode.objects.create(code=token)
    messages.success(request, f'Generated organizer invite code: {token}')


class OrganizerInviteCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'used', 'used_by', 'created_at', 'used_at')
    search_fields = ('code',)
    list_filter = ('used',)
    actions = [generate_invite_code_action]

    def changelist_view(self, request, extra_context=None):
        """Allow generating an invite code via a query parameter so no selection is required.

        Use the admin changelist URL with `?generate=1` to create a code and return with a message.
        """
        if request.GET.get('generate'):
            # Authorize either staff/superuser OR users with role 'admin'
            try:
                is_authorized = (
                    (hasattr(request.user, 'is_staff') and request.user.is_staff)
                    or (hasattr(request.user, 'is_superuser') and request.user.is_superuser)
                    or (hasattr(request.user, 'role') and request.user.role == 'admin')
                )
            except Exception:
                is_authorized = False

            if not request.user.is_active or not is_authorized:
                messages.error(request, 'Not authorized to generate invite codes via admin.')
            else:
                try:
                    token = generate_unique_invite_code()
                    OrganizerInviteCode.objects.create(code=token)
                    messages.success(request, f'Generated organizer invite code: {token}')
                except Exception as exc:
                    messages.error(request, f'Failed to generate invite code: {exc}')

                from django.shortcuts import redirect
                return redirect(request.path)

        return super().changelist_view(request, extra_context=extra_context)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('generate/', self.admin_site.admin_view(self.generate_view), name='users_organizerinvitecode_generate'),
        ]
        return custom_urls + urls

    def generate_view(self, request):
        # Generates an invite code and redirects back to change list with a message
        try:
            is_authorized = (
                (hasattr(request.user, 'is_staff') and request.user.is_staff)
                or (hasattr(request.user, 'is_superuser') and request.user.is_superuser)
                or (hasattr(request.user, 'role') and request.user.role == 'admin')
            )
        except Exception:
            is_authorized = False

        if not request.user.is_active or not is_authorized:
            messages.error(request, 'Not authorized to generate invite codes via admin.')
            return redirect('../../')

        try:
            token = generate_unique_invite_code()
            OrganizerInviteCode.objects.create(code=token)
            messages.success(request, f'Generated organizer invite code: {token}')
            # If this is an AJAX request or JSON is acceptable, return JSON with the code
            is_ajax = request.headers.get('x-requested-with') == 'XMLHttpRequest'
            accepts_json = 'application/json' in request.META.get('HTTP_ACCEPT', '')
            if is_ajax or accepts_json:
                return JsonResponse({'code': token}, status=201)
        except Exception as exc:
            messages.error(request, f'Failed to generate invite code: {exc}')
            is_ajax = request.headers.get('x-requested-with') == 'XMLHttpRequest'
            accepts_json = 'application/json' in request.META.get('HTTP_ACCEPT', '')
            if is_ajax or accepts_json:
                return JsonResponse({'error': str(exc)}, status=500)

        return redirect('../../')


admin.site.register(User)
admin.site.register(OrganizerInviteCode, OrganizerInviteCodeAdmin)