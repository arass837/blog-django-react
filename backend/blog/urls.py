from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blog.views import PostViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    # path('admin/', admin.site.core_urls if hasattr(admin.site, 'core_urls') else admin.site.urls),
    
    # API endpoints
    path('api/', include(router.urls)),
    
    # JWT Login endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
