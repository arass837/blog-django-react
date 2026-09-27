from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0007_private_analytics'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='seo_description',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Optional meta description for search engines (recommended: 140-160 characters).',
                max_length=170,
            ),
        ),
        migrations.AddField(
            model_name='post',
            name='seo_title',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Optional SEO title. Leave blank to use the post title.',
                max_length=70,
            ),
        ),
        migrations.AddField(
            model_name='post',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, blank=True, null=True),
        ),
    ]
