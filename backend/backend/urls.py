from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

# urlpatterns = [
#     path('api/', include('blog.urls')),  # <- tylko /api/
#     path('admin/', admin.site.urls),
#     re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),  # React catch-all
# ]
urlpatterns = [
    path('api/', include('blog.urls')),
    path('admin/', admin.site.urls),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]