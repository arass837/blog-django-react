from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from blog.views import PostViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/', include(router.urls)),

    # JWT endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # React catch-all route (wszystkie pozostałe ścieżki)
    # re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]