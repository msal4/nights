# Generated by Django 3.0.5 on 2020-04-14 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20200414_1134'),
    ]

    operations = [
        migrations.AlterField(
            model_name='viewhit',
            name='type',
            field=models.CharField(blank=True, default='title', max_length=10),
        ),
    ]
