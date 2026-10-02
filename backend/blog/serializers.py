from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Post, Project, Views


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']
        extra_kwargs = {
            'email': {'required': True},
        }

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.first_name')
    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'is_published', 'category', 'content',
            'seo_title', 'seo_description', 'created_at', 'updated_at', 'author_name',
            'likes_count', 'liked_by_me'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by_me(self, obj):
        request = self.context.get('request')
        return bool(
            request
            and request.user.is_authenticated
            and obj.likes.filter(pk=request.user.pk).exists()
        )


class ProjectSerializer(serializers.ModelSerializer):
    technology_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'content',
            'technologies', 'technology_list', 'github_url', 'live_url',
            'image_url', 'is_published', 'is_featured', 'created_at', 'updated_at'
        ]

    def get_technology_list(self, obj):
        return [item.strip() for item in obj.technologies.split(',') if item.strip()]


class ViewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Views
        fields = '__all__'
