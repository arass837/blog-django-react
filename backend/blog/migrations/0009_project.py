from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0008_post_seo_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('slug', models.SlugField(blank=True, unique=True)),
                ('short_description', models.CharField(max_length=300)),
                ('content', models.TextField(blank=True, default='')),
                ('technologies', models.CharField(blank=True, default='', help_text='Comma-separated technologies, e.g. React, Django, DRF, PostgreSQL.', max_length=300)),
                ('github_url', models.URLField(blank=True, default='')),
                ('live_url', models.URLField(blank=True, default='')),
                ('image_url', models.URLField(blank=True, default='', help_text='Optional image URL used on the project card and detail page.')),
                ('is_published', models.BooleanField(default=True)),
                ('is_featured', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-is_featured', '-created_at'],
            },
        ),
    ]
