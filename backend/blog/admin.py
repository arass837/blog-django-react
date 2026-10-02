from django.contrib import admin

from .models import DailyVisit, Post, PostDailyView, PostVisitor, Project, Visitor, Views


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_published', 'created_at', 'updated_at')
    list_filter = ('category', 'is_published')
    search_fields = ('title', 'content', 'seo_title', 'seo_description')
    filter_horizontal = ('likes',)
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        (None, {
            'fields': ('author', 'title', 'slug', 'content', 'category', 'is_published', 'likes'),
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description'),
            'description': 'Optional. Leave blank to generate SEO metadata from the post title and content.',
        }),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_published', 'is_featured', 'created_at', 'updated_at')
    list_filter = ('is_published', 'is_featured')
    search_fields = ('title', 'short_description', 'content', 'technologies')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'short_description', 'content'),
        }),
        ('Project details', {
            'fields': ('technologies', 'image_url', 'github_url', 'live_url'),
        }),
        ('Publishing', {
            'fields': ('is_published', 'is_featured'),
        }),
    )


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_seen', 'last_seen')
    readonly_fields = ('visitor_hash', 'first_seen', 'last_seen')


@admin.register(DailyVisit)
class DailyVisitAdmin(admin.ModelAdmin):
    list_display = ('date', 'visitor')
    list_filter = ('date',)


@admin.register(PostVisitor)
class PostVisitorAdmin(admin.ModelAdmin):
    list_display = ('post', 'visitor', 'first_seen')
    search_fields = ('post__title',)


@admin.register(PostDailyView)
class PostDailyViewAdmin(admin.ModelAdmin):
    list_display = ('post', 'date', 'views')
    list_filter = ('date',)
    search_fields = ('post__title',)


admin.site.register(Views)
