from django.db import models
from django.contrib.auth.models import User

# class Post(models.Model):
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
#     title = models.CharField(max_length=200)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title
    
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Post(models.Model):
    CATEGORY_CHOICES = [
        ('python', 'Python'),
        ('django', 'Django'),
        ('react', 'React'),
        ('fullstack', 'React & Django'),  # tylko te posty mogą być aktualnością
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)  # wygenerowany automatycznie
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='fullstack')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # 🔥 Generowanie slug jeśli pusty
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            num = 1
            while Post.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Views(models.Model):
    name = models.CharField(max_length=100, unique=True)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name}: {self.count}"