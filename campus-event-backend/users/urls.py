from django.urls import path
from .views import RegisterView
from .views import ProfileView
from .views import admin_list_users
from .views import InviteCodeView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view()),
    path("admin/users/", admin_list_users, name="admin_list_users"),
    path("admin/invite-codes/", InviteCodeView.as_view(), name="invite_codes"),
]