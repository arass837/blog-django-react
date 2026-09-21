from django.contrib import admin

from .models import DailyVisit, Post, PostDailyView, PostVisitor, Visitor, Views


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_published', 'created_at')
    list_filter = ('category', 'is_published')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}


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
