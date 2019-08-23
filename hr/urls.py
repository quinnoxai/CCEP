from importlib import import_module
from django.contrib import admin
from django.urls import path

from django.conf.urls import url,include
from . import views
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    url(r'^chat', views.chat, name='chat'),
    url(r'^home', views.homepage,name="index"),
    url(r'^add_user', views.add_user,name="user_page"),
    url(r'^logdata', views.loginData, name="logdata"),
    url(r'^logout', views.logout, name='logout'),
    url(r'^register', views.add_user_page,name="user_page"),
    url(r'^welcome',views.welcome_msg,name='user_name'),
    url(r'^', views.login_user, name="loginuser"),
]
