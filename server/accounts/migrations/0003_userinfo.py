# Generated by Django 5.1.3 on 2024-12-19 03:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_rename_first_name_useraccount_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=200)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], max_length=6)),
                ('dob', models.DateField()),
                ('contact', models.CharField(max_length=15)),
                ('address', models.CharField(max_length=200)),
                ('about', models.CharField(max_length=600)),
            ],
        ),
    ]