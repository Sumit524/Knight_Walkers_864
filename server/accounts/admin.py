from django.contrib import admin
from .models import OptionCategory, Option, UserPreference
# Register OptionCategory and Option models
class OptionInline(admin.TabularInline):
    model = Option
    extra = 1  # This controls how many empty forms are shown by default

class OptionCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ['name']
    inlines = [OptionInline]  # Displaying options inline under their category

# Register SelectedOptions model
class SelectedOptionsAdmin(admin.ModelAdmin):
    list_display = ('user', 'selected_categories')  # Display selected categories in list view
    search_fields = ['user__username']  # Allow searching by user

from .models import UserAccount,UserInfo,Option,OptionCategory,UserPreference
admin.site.register(UserInfo)
admin.site.register(UserAccount)
admin.site.register(UserPreference)