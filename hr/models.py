from django.db import models
from django.contrib.auth.models import User
from mongoengine import *
from mongoengine import Document
#     comments = ListField()
from mongoengine import connect
from django.core.validators import RegexValidator

#USERNAME_REGEX = '^[a-zA-Z0-9.+-]*$'
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)

connect('calypso')




class CalypsoUser(Document):
    firstname = StringField()
    user_id = StringField()
    username=StringField()
    password= StringField()
    emailid=StringField()
    role=StringField()
    lastname=StringField()


class UserProfileInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.TextField(blank=True)
    portfolio_site = models.URLField(blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics', blank=True)


def __str__(self):
    return self.user.username, self.user.role
