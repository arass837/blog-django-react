from rest_framework import serializers
from .models import Post, Views

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.first_name')

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'is_published','category','content', 'created_at', 'author_name']

class ViewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Views
        fields = '__all__'