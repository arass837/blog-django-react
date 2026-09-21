from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def health_check(request):
    return JsonResponse({"status": "ok", "service": "reactodjango-api"})


urlpatterns = [
    path("", health_check, name="health_check"),
    path("admin/", admin.site.urls),
    path("api/", include("blog.urls")),

    # JWT endpoints used by the React app (its base URL already ends in /api/).
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Backwards-compatible endpoints for existing clients/bookmarks.
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair_legacy"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh_legacy"),
]
