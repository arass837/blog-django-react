from rest_framework.routers import DefaultRouter
from .views import PostViewSet, ViewsViewSet
from django.urls import path
from rest_framework.routers import DefaultRouter
# from .views import PostViewSet, increment_homepage_views

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'views', ViewsViewSet, basename='views')

urlpatterns = router.urls

# urlpatterns = [

#     path('views/', increment_homepage_views),
# ]