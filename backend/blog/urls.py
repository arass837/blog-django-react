from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CurrentUserView, PostViewSet, ProjectViewSet, RegisterView, ViewsViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'views', ViewsViewSet, basename='views')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
] + router.urls
