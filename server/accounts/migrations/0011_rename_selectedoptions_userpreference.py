# Generated by Django 5.1.4 on 2024-12-20 15:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_optioncategory_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='SelectedOptions',
            new_name='UserPreference',
        ),
    ]