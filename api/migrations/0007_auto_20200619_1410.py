# Generated by Django 3.0.6 on 2020-06-19 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20200619_0833'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='title',
            name='featured',
        ),
        migrations.RemoveField(
            model_name='title',
            name='is_slide',
        ),
        migrations.AddField(
            model_name='title',
            name='featured_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='title',
            name='promoted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
