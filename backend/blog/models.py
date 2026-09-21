from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify


class Post(models.Model):
    CATEGORY_CHOICES = [
        ('python', 'Python'),
        ('django', 'Django'),
        ('react', 'React'),
        ('fullstack', 'React & Django'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='fullstack')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or 'post'
            slug = base_slug
            num = 1
            while Post.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Views(models.Model):
    """Legacy counter kept for compatibility with the existing database."""

    name = models.CharField(max_length=100, unique=True)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name}: {self.count}"


class Visitor(models.Model):
    """Anonymous browser/device identifier stored only as a one-way hash."""

    visitor_hash = models.CharField(max_length=64, unique=True, db_index=True)
    first_seen = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Visitor {self.pk}"


class DailyVisit(models.Model):
    """One record per anonymous visitor per calendar day."""

    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name='daily_visits')
    date = models.DateField(default=timezone.localdate, db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['visitor', 'date'], name='unique_visitor_per_day'),
        ]
        ordering = ['-date']

    def __str__(self):
        return f"{self.date} / visitor {self.visitor_id}"


class PostVisitor(models.Model):
    """Unique reader for a post. One browser/device is counted once per article."""

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='unique_post_visitors')
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE, related_name='visited_posts')
    first_seen = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['post', 'visitor'], name='unique_visitor_per_post'),
        ]

    def __str__(self):
        return f"{self.post_id} / visitor {self.visitor_id}"


class PostDailyView(models.Model):
    """Aggregated page-view counter per post and day."""

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='daily_view_stats')
    date = models.DateField(default=timezone.localdate, db_index=True)
    views = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['post', 'date'], name='unique_post_view_day'),
        ]
        ordering = ['-date']

    def __str__(self):
        return f"{self.post.slug} / {self.date}: {self.views}"
