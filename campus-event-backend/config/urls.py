"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static

from users.views import InviteCodeView, RegisterView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [

    path(
        'admin/',
        admin.site.urls
    ),

    path(
        'api/register/',
        RegisterView.as_view(),
        name='register_short'
    ),

    path(
        'api/admin/invite-codes/',
        InviteCodeView.as_view(),
        name='invite_codes_short'
    ),

    path(
        'api/users/',
        include('users.urls')
    ),

    path(
        'api/events/',
        include('events.urls')
    ),

    path(
        'api/token/',
        TokenObtainPairView.as_view()
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view()
    ),
    
    path(
    'api/attendance/',
    include('attendance.urls')
),

path(
    'api/recommendations/',
    include('recommendations.urls')
),
path(
    'api/analytics/',
    include(
        'analytics_app.urls'
    )
),
path(
    'api/certificates/',
    include(
        'certificates.urls'
    )

),

]
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
