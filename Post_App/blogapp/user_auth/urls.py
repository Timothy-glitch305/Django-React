from django.urls import path, include
from . import views as v
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("", include("rest_framework.urls")),
    path("register/", v.CreateUserView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("token/obtain/", TokenObtainPairView.as_view())
]

if settings.DEBUG:
    urlpatterns  += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)