# Generated by Django 5.0.1 on 2024-01-03 14:49

import django.core.validators
import pong.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0003_remove_ft_user_first_name_remove_ft_user_login_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ft_user',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to='', validators=[pong.models.validate_file_size, django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'svg'])]),
        ),
    ]
