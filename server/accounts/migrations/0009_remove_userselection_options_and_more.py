# Generated by Django 5.1.4 on 2024-12-20 10:49

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_preferencesoption_userselection_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userselection',
            name='options',
        ),
        migrations.RemoveField(
            model_name='userselection',
            name='user',
        ),
        migrations.CreateModel(
            name='SelectedOptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('selected_options', models.JSONField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='PreferencesOption',
        ),
        migrations.DeleteModel(
            name='UserSelection',
        ),
    ]
