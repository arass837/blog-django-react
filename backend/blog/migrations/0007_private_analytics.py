# Generated for private anonymous visitor analytics.

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0006_alter_post_slug'),
    ]

    operations = [
        migrations.CreateModel(
            name='Visitor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visitor_hash', models.CharField(db_index=True, max_length=64, unique=True)),
                ('first_seen', models.DateTimeField(auto_now_add=True)),
                ('last_seen', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='DailyVisit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(db_index=True, default=django.utils.timezone.localdate)),
                ('visitor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='daily_visits', to='blog.visitor')),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='PostDailyView',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(db_index=True, default=django.utils.timezone.localdate)),
                ('views', models.PositiveIntegerField(default=0)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='daily_view_stats', to='blog.post')),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='PostVisitor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_seen', models.DateTimeField(auto_now_add=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='unique_post_visitors', to='blog.post')),
                ('visitor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visited_posts', to='blog.visitor')),
            ],
        ),
        migrations.AddConstraint(
            model_name='dailyvisit',
            constraint=models.UniqueConstraint(fields=('visitor', 'date'), name='unique_visitor_per_day'),
        ),
        migrations.AddConstraint(
            model_name='postdailyview',
            constraint=models.UniqueConstraint(fields=('post', 'date'), name='unique_post_view_day'),
        ),
        migrations.AddConstraint(
            model_name='postvisitor',
            constraint=models.UniqueConstraint(fields=('post', 'visitor'), name='unique_visitor_per_post'),
        ),
    ]
