# Generated by Django 5.1.3 on 2024-11-10 20:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0002_userinsocket_is_availble'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userinsocket',
            old_name='is_availble',
            new_name='is_available',
        ),
    ]