import json
from channels.generic.websocket import AsyncWebsocketConsumer
from haversine import haversine, Unit
from .models import UserInSocket
from accounts.models import UserAccount
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist


class MatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['id']
        self.room_group_name = f"match_general"
    
    # Add user to the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
    async def disconnect(self, close_code):
        print("\n entering disconnect socket")
        try:
            # Leave the group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

            # Fetch the user and delete from UserInSocket model
            my_user = await database_sync_to_async(UserAccount.objects.get)(id=self.id)
            print("\n My User:: ", my_user.name)

            # Delete the user from UserInSocket
            await database_sync_to_async(UserInSocket.objects.filter(user__id=self.id).delete)()
            print("\n User exited from socket and removed from socket model")

        except ObjectDoesNotExist:
            print("\n User with the given ID does not exist.")



    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # Extract the data you need
        user_id = self.id  # Assuming user ID is sent in the message
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        range_radius = data.get("range_radius", 5000)
        preference = data.get("preference", "")

        # Insert the data into the UserInSocket model
        new_user_in_socket = await self.save_user_data(user_id, latitude, longitude, range_radius, preference)
        await self.find_nearby_users(new_user_in_socket)

    @database_sync_to_async
    def save_user_data(self, user_id, latitude, longitude, range_radius, preference):
        from accounts.models import UserAccount

        # Fetch the user instance
        user = UserAccount.objects.get(id=user_id)

        # Create a new UserInSocket entry
        new_user_in_socket = UserInSocket.objects.create(
            user=user,
            latitude=latitude,
            longitude=longitude,
            range_radius=range_radius,
            preference=preference
        )
        print("\n new user in socket added: ", new_user_in_socket.user.name)
        return new_user_in_socket

    async def find_nearby_users(self, new_user_in_socket):
        # Retrieve nearby users based on interest
        print("\n Going to print nearby users: ")
        users_within_range = await self.get_nearby_users(new_user_in_socket)
        for user in users_within_range:
            print(f'\t ${user['username']}')

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'nearby_users_message',
                'users': "Me aa gya"
            }
        )
    
    async def nearby_users_message(self, event):
        users = event['users']

        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'action': 'nearby_users',
            'users': users
        }))

    @database_sync_to_async
    def get_nearby_users(self, user_in_socket):
        # If user has no location, return an empty list
        if not user_in_socket.latitude or not user_in_socket.longitude:
            return []

        location_point = (user_in_socket.latitude, user_in_socket.longitude)
        range_radius = user_in_socket.range_radius

        # Retrieve all other users' locations
        all_other_users_in_socket = UserInSocket.objects.exclude(user__id=self.id)
        print("Running a loop to searcg other users :: ")
        users_with_interest = []
        for user in all_other_users_in_socket:
            print("\n others in socket::", user.user.name)
            other_location_point = (user.latitude, user.longitude)

            # Calculate distance between locations using haversine
            distance = haversine(location_point, other_location_point, unit=Unit.METERS)

            # Check if within the specified range and if user has the specified interest
            if distance <= range_radius and user.preference==user_in_socket.preference:
                users_with_interest.append({
                    'id': user.user.id,
                    'username': user.user.name,
                    'distance': distance
                })

        # Sort users by distance for better user experience
        users_with_interest.sort(key=lambda x: x['distance'])
        
        return users_with_interest
