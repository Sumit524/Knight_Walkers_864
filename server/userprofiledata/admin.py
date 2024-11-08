from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import UserData,UserPreferences



admin.site.register(UserData)




@admin.register(UserPreferences)
class UserDataAdmin(admin.ModelAdmin):
    list_display = ('user', 'availability', 'meetup_frequency')
    search_fields = ('user__username', 'availability')
    list_filter = ('availability', 'meetup_frequency')
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Venue Preferences', {'fields': ('venue_types', 'ambiance_preferences')}),
        ('Music & Event Preferences', {'fields': ('favorite_music_genres', 'event_interests', 'pre_event_activities')}),
        ('Food and Drink Preferences', {'fields': ('dietary_preferences', 'drink_preferences')}),
        ('Preferred Vibe', {'fields': ('social_vibe', 'decor_preferences')}),
        ('Meeting and Scheduling Preferences', {'fields': ('availability', 'meetup_frequency')}),
    )

