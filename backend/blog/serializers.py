from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.first_name')

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'author_name']
