# Generated by Django 3.0.5 on 2020-04-21 16:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('api', '0011_auto_20200421_1941'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='EpisodeVideo',
            new_name='Trailer',
        ),
    ]
