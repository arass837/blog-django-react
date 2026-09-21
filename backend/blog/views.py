import hashlib
from datetime import timedelta

from django.db.models import Count, F, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import DailyVisit, Post, PostDailyView, PostVisitor, Visitor, Views
from .serializers import PostSerializer, ViewsSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ViewsViewSet(viewsets.ModelViewSet):
    """
    Public visitors can write anonymous analytics only.
    Statistics can be read only by Django staff/admin users.
    No IP address is stored.
    """

    queryset = Views.objects.all()
    serializer_class = ViewsSerializer

    def get_permissions(self):
        if self.action in {'increment', 'track', 'track_post'}:
            return [AllowAny()]
        return [IsAdminUser()]

    @staticmethod
    def _visitor_hash(raw_visitor_id):
        if not isinstance(raw_visitor_id, str):
            return None
        raw_visitor_id = raw_visitor_id.strip()
        if not raw_visitor_id or len(raw_visitor_id) > 200:
            return None
        return hashlib.sha256(raw_visitor_id.encode('utf-8')).hexdigest()

    def _get_visitor(self, request):
        # The owner/admin should not inflate their own public statistics.
        if request.user.is_authenticated and request.user.is_staff:
            return None, Response({'tracked': False, 'reason': 'admin'}, status=status.HTTP_200_OK)

        visitor_hash = self._visitor_hash(request.data.get('visitor_id'))
        if not visitor_hash:
            return None, Response(
                {'detail': 'visitor_id is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        visitor, created = Visitor.objects.get_or_create(visitor_hash=visitor_hash)
        if not created:
            # Trigger auto_now on last_seen without changing any identifying data.
            visitor.save(update_fields=['last_seen'])
        return visitor, None

    @action(detail=False, methods=['post'])
    def increment(self, request):
        """Backward-compatible endpoint used by the previous frontend version."""
        obj, _ = Views.objects.get_or_create(name='homepage')
        obj.count = F('count') + 1
        obj.save(update_fields=['count'])
        obj.refresh_from_db(fields=['count'])
        return Response({'views': obj.count})

    @action(detail=False, methods=['post'], url_path='track')
    def track(self, request):
        """Track an anonymous site visitor once per day."""
        visitor, early_response = self._get_visitor(request)
        if early_response:
            return early_response

        today = timezone.localdate()
        _, daily_created = DailyVisit.objects.get_or_create(visitor=visitor, date=today)
        return Response({'tracked': True, 'new_today': daily_created})

    @action(detail=False, methods=['post'], url_path='post')
    def track_post(self, request):
        """Track one article page view and its unique anonymous reader."""
        visitor, early_response = self._get_visitor(request)
        if early_response:
            return early_response

        slug = (request.data.get('slug') or '').strip()
        if not slug:
            return Response({'detail': 'slug is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.get(slug=slug, is_published=True)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.localdate()
        DailyVisit.objects.get_or_create(visitor=visitor, date=today)
        _, unique_created = PostVisitor.objects.get_or_create(post=post, visitor=visitor)

        daily_counter, _ = PostDailyView.objects.get_or_create(post=post, date=today)
        PostDailyView.objects.filter(pk=daily_counter.pk).update(views=F('views') + 1)

        return Response({'tracked': True, 'new_reader': unique_created})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        today = timezone.localdate()
        yesterday = today - timedelta(days=1)
        seven_days_ago = today - timedelta(days=6)
        thirty_days_ago = today - timedelta(days=29)

        all_time_unique = Visitor.objects.count()
        today_unique = DailyVisit.objects.filter(date=today).count()
        yesterday_unique = DailyVisit.objects.filter(date=yesterday).count()
        last_7_days_unique = (
            DailyVisit.objects.filter(date__gte=seven_days_ago, date__lte=today)
            .values('visitor_id')
            .distinct()
            .count()
        )
        last_30_days_unique = (
            DailyVisit.objects.filter(date__gte=thirty_days_ago, date__lte=today)
            .values('visitor_id')
            .distinct()
            .count()
        )

        post_rows = (
            Post.objects.filter(is_published=True)
            .annotate(
                total_views=Coalesce(Sum('daily_view_stats__views'), 0),
                unique_readers=Count('unique_post_visitors', distinct=True),
            )
            .order_by('-total_views', '-created_at')
        )

        posts = [
            {
                'id': post.id,
                'title': post.title,
                'slug': post.slug,
                'total_views': post.total_views,
                'unique_readers': post.unique_readers,
            }
            for post in post_rows
        ]

        return Response({
            'unique_visitors': {
                'all_time': all_time_unique,
                'today': today_unique,
                'yesterday': yesterday_unique,
                'last_7_days': last_7_days_unique,
                'last_30_days': last_30_days_unique,
            },
            'posts': posts,
            'generated_for_date': today.isoformat(),
        })
