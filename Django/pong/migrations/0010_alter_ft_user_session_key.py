# Generated by Django 5.0.1 on 2024-01-10 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0009_matchhistory'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ft_user',
            name='session_key',
            field=models.CharField(blank=True, max_length=40, null=True),
        ),
    ]
