# Generated by Django 5.0.1 on 2024-01-04 14:48

import django.core.validators
import pong.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0006_alter_ft_user_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ft_user',
            name='image',
            field=models.FileField(blank=True, default='Alex_Circle.svg', null=True, upload_to='', validators=[pong.models.validate_file_size, django.core.validators.FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'svg'])]),
        ),
    ]
