# Generated by Django 5.0.1 on 2024-01-03 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0002_ft_user_language_preference'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ft_user',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='ft_user',
            name='login',
        ),
        migrations.AddField(
            model_name='ft_user',
            name='display_name',
            field=models.CharField(default='DefaultName', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='ft_user',
            name='intra_name',
            field=models.CharField(default='DefaultName', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='ft_user',
            name='session_key',
            field=models.CharField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='ft_user',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]
