from django.db import models

# Define an Enum class for gender choices
class Gender(models.TextChoices):
    MALE = 'M', 'Male'
    FEMALE = 'F', 'Female'
    OTHER = 'O', 'Other'
    PREFER_NOT_TO_SAY = 'N', 'Prefer not to say'

class UserData(models.Model):
    first_name = models.CharField(max_length=50, blank=False)
    last_name = models.CharField(max_length=50, blank=True)  # Optional
    profile_image = models.ImageField(upload_to='profile_images/', blank=False, null=False)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=2,
        choices=Gender.choices,  # Use the enum choices
        blank=False
    )
    full_address = models.CharField(max_length=100, blank=True)  # Optional
    contact_number = models.CharField(max_length=15, blank=False)
    bio = models.TextField(max_length=150, blank=True)  # Optional

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    




from django.db import models


class UserPreferences(models.Model):
    # Link to the user
    user = models.OneToOneField( UserData, on_delete=models.CASCADE, related_name="preferences")

    # Venue Preferences
    venue_types = models.JSONField(default=list)  # Store types like cafes, bars, parks, etc.
    ambiance_preferences = models.JSONField(default=list)  # Music-themed, graffiti-filled, etc.

    # Music & Event Preferences
    favorite_music_genres = models.JSONField(default=list)  # E.g., rock, jazz, indie
    event_interests = models.JSONField(default=list)  # Concerts, festivals, etc.
    pre_event_activities = models.JSONField(default=list)  # Coffee, drinks, relaxation in park, etc.

    # Food and Drink Preferences
    dietary_preferences = models.JSONField(default=list)  # Vegan, vegetarian, etc.
    drink_preferences = models.JSONField(default=list)  # Coffee Shops, Cocktail Bars, etc.

    # Preferred Vibe
    social_vibe = models.JSONField(default=list)  # Chill and Quiet, Vibrant and Social, etc.
    decor_preferences = models.JSONField(default=list)  # Graffiti art, vintage decor, etc.

    # Meeting and Scheduling Preferences
    availability = models.CharField(max_length=50, null=True, blank=True)  # E.g., "Weekends Only", "After 6 PM"
    meetup_frequency = models.CharField(max_length=20, null=True, blank=True)  # Daily, weekly, monthly, etc.

    def __str__(self):
        return f"{self.user.first_name}'s Preferences"

