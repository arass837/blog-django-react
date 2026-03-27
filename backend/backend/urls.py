from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('blog.urls')),  # wszystko co w blog.urls pod 'api/'
    # Catch-all dla React
    re_path(r'^.*$', TemplateView.as_view(template_name='../frontend/build/index.html')),
]