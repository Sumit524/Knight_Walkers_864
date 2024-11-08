from django.shortcuts import redirect
from .models import CustomUser  # Correct model import
from rest_framework import generics
from .serializers import CustomUserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class UserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()  # Correct model
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()  # Correct model
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

@login_required
def google_login_callback(request):
    user = request.user
    print("Line 37 views.py Authen:", user)
    
    # Check if user has a social account
    social_accounts = SocialAccount.objects.filter(user=user)
    print("Social Account for user:", social_accounts)

    if not social_accounts.exists():
        print("No social account found for user:", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')

    social_account = social_accounts.first()
    
    # Fetch the Google token associated with the social account
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
            # Parse JSON request body
            data = json.loads(request.body)
            google_access_token = data.get('access_token')

            # Check if access_token is provided
            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)

            # Verify the Google access token using Google API
            try:
                id_info = id_token.verify_oauth2_token(google_access_token, Request())

                # If the token is valid, return success response
                return JsonResponse({'valid': True})
            except ValueError:
                # Invalid token error
                return JsonResponse({'valid': False, 'detail': 'Invalid Google token.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON format.'}, status=400)

    return JsonResponse({'detail': 'Method not allowed.'}, status=405)




class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        print("Incoming login request data:", request.data)  # Log the incoming data for debugging
        return super().post(request, *args, **kwargs)
    



