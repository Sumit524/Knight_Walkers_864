from django.shortcuts import redirect
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

User = get_user_model()


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    

@login_required
def google_login_callback(request):
    user = request.user

    social_accounts = SocialAccount.objects.filter(user=user)
    print("Social Account for user:", social_accounts)

    social_account = social_accounts.first()

    if not social_account:
        print("No social account for user:", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')
    
    token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

    if token:
        print('Google token found:', token.token)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
    else:
        print('No Google token found for user', user)
        return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')


@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')
            print(google_access_token)

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
    return JsonResponse({'detail': 'Method not allowed.'}, status=405)

import requests
from django.http import JsonResponse
from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django!"})



import requests
from django.http import JsonResponse
from django.conf import settings


def search_nearby_locations(request):
    # Example user preferences
    
    params = {
        'categories': 'catering',
        # 'conditions': 'vegetarian',
        'filter': 'circle:80.93795405061269,26.84033392181192,10000',
        'bias' : 'proximity:80.93795405061269,26.84033392181192',
        'limit': 20,
        'apiKey': settings.GEOAPIFY_API_KEY  # Replace with your actual API key
    }
  
    # Geoapify API endpoint for places
    api_url = "https://api.geoapify.com/v2/places"

    print("Request Parameters:", params)  # Debugging: Print request parameters

    # Make the request to Geoapify API
    response = requests.get(api_url, params=params)

    # Check for response status and handle errors
    if response.status_code != 200:
        print("Error response:", response.json())  # Debugging: Print error response
        return JsonResponse({'error': 'Error fetching data from Geoapify'}, status=response.status_code)

    data = response.json()
    print("API Response Data:", data)  # Debugging: Print API response data

    # Extract relevant location data
    matching_locations = []
    for feature in data.get('features', []):
        properties = feature.get('properties', {})
        matching_locations.append({
            'name': properties.get('name'),
            'address': properties.get('formatted', 'Unknown address'),
            'rating': properties.get('rating', 'N/A'),
            'distance': feature.get('distance', 'N/A'),
            'categories': properties.get('categories', [])
        })

    return JsonResponse(matching_locations, safe=False)