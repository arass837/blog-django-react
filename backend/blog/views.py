from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    # Automatyczne przypisywanie zalogowanego usera jako autora przy tworzeniu posta
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import Views
from .serializers import ViewsSerializer

class ViewsViewSet(viewsets.ModelViewSet):
    queryset = Views.objects.all()
    serializer_class = ViewsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    # permission_classes = [AllowAny]

    # 🔥 custom endpoint: /api/views/increment/
    @action(detail=False, methods=['post'])
    def increment(self, request):
        obj, created = Views.objects.get_or_create(name="homepage")

        obj.count = F('count') + 1
        obj.save()
        obj.refresh_from_db()

        return Response({"views": obj.count})