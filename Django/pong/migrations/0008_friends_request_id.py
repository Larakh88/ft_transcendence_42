# Generated by Django 5.0.1 on 2024-01-05 21:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0007_alter_ft_user_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='friends',
            name='request_id',
            field=models.ForeignKey(default='1', on_delete=django.db.models.deletion.CASCADE, to='pong.friendrequest'),
            preserve_default=False,
        ),
    ]