from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('api/', include('blog.urls')),
    path('admin/', admin.site.urls),   
 
    # JWT endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # React SPA do łączenia wszystkich enpiont z django

    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),

    ]