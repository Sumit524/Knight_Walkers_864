from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import UserInfo
from .serializers import UserInfoSerializer

class UserInfoListCreateView(generics.ListCreateAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def perform_create(self, serializer):
        serializer.save()



#  1. RetrieveUpdateDestroyAPIView
# This view is used for retrieving, updating, and deleting a single instance of a model. It provides the following actions:

# Retrieve: To get details of a specific resource (GET request).
# Update: To modify the existing resource (PUT or PATCH request).
# Destroy: To delete the resource (DELETE request).

class UserInfoDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view


#      ListCreateAPIView
# This view is used for listing all instances of a model and creating new resources. It provides the following actions:

# List: To get a list of all resources (GET request).
# Create: To create a new resource (POST request).



from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserPreference
from .serializers import SelectedOptionsSerializer

class SelectPreferenceCreateView(generics.ListCreateAPIView):
    queryset = UserPreference.objects.all()
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated
    serializer_class =SelectedOptionsSerializer

    def post(self, request, *args, **kwargs):
        selected_categories = request.data.get('selectedCategories')  # Expected to be a dict of category options

        if not isinstance(selected_categories, dict):
            return Response(
                {"error": "Invalid data format. 'selectedCategories' should be a dictionary."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the user already has an entry for selected options
        try:
            selected_options_instance = UserPreference.objects.get(user=request.user)
            selected_options_instance.selected_categories = selected_categories
            selected_options_instance.save()
        except UserPreference.DoesNotExist:
            selected_options_instance = UserPreference.objects.create(
                user=request.user,
                selected_categories=selected_categories
            )

        # Serialize the updated or newly created instance
        serializer = SelectedOptionsSerializer(selected_options_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

from django.shortcuts import get_object_or_404

class SelectPreferenceDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserPreference.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SelectedOptionsSerializer

    def get_queryset(self):
        # Filter preferences for the authenticated user
        return UserPreference.objects.filter(user=self.request.user)

    def get_object(self):
        # Retrieve the specific user based on user ID passed as a query parameter
        user_id = self.kwargs.get('user_id')  # Assuming 'user_id' is passed in the URL
        return get_object_or_404(UserPreference, user_id=user_id)
    



from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfileImage
from .serializers import UserProfileImageSerializer

class UserProfileImageView(RetrieveUpdateAPIView):
    queryset = UserProfileImage.objects.all()
    serializer_class = UserProfileImageSerializer
    permission_classes = [IsAuthenticated]

    
    def get_object(self):
        # Ensure the profile is tied to the authenticated user
        profile, created = UserProfileImage.objects.get_or_create(user=self.request.user)
        return profile
    
    

    def put(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.serializer_class(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    





from rest_framework.views import APIView


class UserProfileImageDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfileImage.objects.get_or_create(user=request.user)
        serializer = UserProfileImageSerializer(profile)
        return Response(serializer.data)













    
