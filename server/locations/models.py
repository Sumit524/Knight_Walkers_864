# from django.db import models
# from django.contrib.auth.models import User

# class UserLocation(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     latitude = models.FloatField()  # Store latitude
#     longitude = models.FloatField()  # Store longitude
#     range_radius = models.IntegerField(default=5000)  # in meters

# class Interest(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     interest_name = models.CharField(max_length=100)  # e.g., "zoo"
#     timestamp = models.DateTimeField(auto_now_add=True)
