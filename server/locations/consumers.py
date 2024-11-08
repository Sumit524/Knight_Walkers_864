# # consumers.py

# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from haversine import haversine, Unit
# from .models import UserLocation, Interest

# class MatchConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.user = self.scope['user']
#         self.user_location = await self.get_user_location()
#         await self.accept()

#     async def disconnect(self, close_code):
#         pass

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         if data['action'] == 'find_nearby':
#             await self.find_nearby_users(data['interest'])

#     async def find_nearby_users(self, interest_name):
#         users_within_range = await self.get_nearby_users(interest_name)
#         await self.send(text_data=json.dumps({
#             'action': 'nearby_users',
#             'users': users_within_range
#         }))


#     async def get_nearby_users(self, interest_name):
#         if not self.user_location:
#             return []

#         location_point = (self.user_location.latitude, self.user_location.longitude)  # User's location as a tuple
#         range_radius = self.user_location.range_radius

#         # Retrieve all users' locations from the database
#         all_user_locations = UserLocation.objects.exclude(user=self.user_location.user)

#         users_with_interest = []
#         for user_location in all_user_locations:
#             other_location_point = (user_location.latitude, user_location.longitude)

#             # Calculate distance using haversine in meters
#             distance = haversine(location_point, other_location_point, unit=Unit.METERS)

#             # Check if within the specified range
#             if distance <= range_radius:
#                 # Check if user has the specified interest
#                 if Interest.objects.filter(user=user_location.user, interest_name=interest_name).exists():
#                     users_with_interest.append({
#                         'user_id': user_location.user.id,
#                         'username': user_location.user.username,
#                         'distance': distance
#                     })

#         # Sort users by distance
#         users_with_interest.sort(key=lambda x: x['distance'])
        
#         return users_with_interest

#     async def get_user_location(self):
#         try:
#             return await UserLocation.objects.get(user=self.user)
#         except UserLocation.DoesNotExist:
#             return None
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from haversine import haversine, Unit
from .models import UserLocation, Interest
from asgiref.sync import sync_to_async

class MatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.user_location = await self.get_user_location()
        print("User Location object : ", self.user_location)
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['action'] == 'find_nearby':
            await self.find_nearby_users(data['interest'])

    async def find_nearby_users(self, interest_name):
        # Retrieve nearby users based on interest
        users_within_range = await self.get_nearby_users(interest_name)
        await self.send(text_data=json.dumps({
            'action': 'nearby_users',
            'users': users_within_range
        }))

    @sync_to_async
    def get_user_location(self):
        try:
            return UserLocation.objects.get(user=self.user)
        except UserLocation.DoesNotExist:
            return None

    @sync_to_async
    def get_nearby_users(self, interest_name):
        # If user has no location, return an empty list
        if not self.user_location:
            return []

        location_point = (self.user_location.latitude, self.user_location.longitude)
        range_radius = self.user_location.range_radius

        # Retrieve all other users' locations
        all_user_locations = UserLocation.objects.exclude(user=self.user_location.user)

        users_with_interest = []
        for user_location in all_user_locations:
            other_location_point = (user_location.latitude, user_location.longitude)

            # Calculate distance between locations using haversine
            distance = haversine(location_point, other_location_point, unit=Unit.METERS)

            # Check if within the specified range and if user has the specified interest
            if distance <= range_radius and Interest.objects.filter(user=user_location.user, interest_name=interest_name).exists():
                users_with_interest.append({
                    'user_id': user_location.user.id,
                    'username': user_location.user.username,
                    'distance': distance
                })

        # Sort users by distance for better user experience
        users_with_interest.sort(key=lambda x: x['distance'])
        
        return users_with_interest
