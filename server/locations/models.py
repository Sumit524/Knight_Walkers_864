from django.db import models
from accounts.models import UserAccount

class UserInSocket(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    latitude = models.FloatField()  # Store latitude
    longitude = models.FloatField()  # Store longitude
    range_radius = models.IntegerField(default=5000)  # in meters
    preference = models.CharField(max_length=50)
    is_available= models.BooleanField(default=True)

# class Interest(models.Model):
#     user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)    
#     interest_name = models.CharField(max_length=100)  # e.g., "zoo"
#     timestamp = models.DateTimeField(auto_now_add=True)
