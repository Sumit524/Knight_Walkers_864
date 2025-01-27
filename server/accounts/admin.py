from django.contrib import admin
from .models import UserAccount,UserInfo,UserPreference,UserPreference,UserProfileImage,Experience
admin.site.register(UserInfo)
admin.site.register(UserAccount)
admin.site.register(UserPreference)
admin.site.register(UserProfileImage)
admin.site.register(Experience)
