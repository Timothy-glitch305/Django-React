from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class CustomUser(AbstractUser):
    profile_image = models.ImageField(
        upload_to="profiles/",
        default="profiles/default_profile_picture.jpg",
    )