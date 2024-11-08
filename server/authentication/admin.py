from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):  # Corrected the typo in the class name
    list_display = ('id', 'email', 'date_joined', 'is_active')  # Display specified fields in the list view
    search_fields = ('email',)  # Enable search by email
    list_filter = ('is_active', 'date_joined')  # Enable filters by active status and join date
    readonly_fields = ('id', 'date_joined')  # Make ID and date joined fields read-only
