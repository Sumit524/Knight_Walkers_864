from django.contrib import admin

# Register your models here.
from django.contrib import admin

from django.contrib import admin
from .models import UserAccount,UserInfo

admin.site.register(UserInfo)
admin.site.register(UserAccount)
