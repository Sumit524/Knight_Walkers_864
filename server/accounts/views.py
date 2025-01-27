from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import UserInfo,UserPreference,UserProfileImage,Experience
from .serializers import UserInfoSerializer,SelectedOptionsSerializer,UserProfileImageSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateAPIView

# class UserInfoListCreateView(generics.ListCreateAPIView):
#     queryset = UserInfo.objects.all()
#     serializer_class = UserInfoSerializer
#     permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

#     def perform_create(self, serializer):
#         serializer.save()


# UserInfoListCreateView





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ExperienceSummarySerializer
from .models import Experience
from .serializers import ExperienceSummarySerializer

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ExperienceSummarySerializer
from .models import Experience

class ExperienceView(APIView):
    def get(self, request, *args, **kwargs):
        """Fetch all experiences or filter based on user."""
        user = request.query_params.get("user")  # Optional filtering by user
        if user:
            experiences = Experience.objects.filter(user=user)
        else:
            experiences = Experience.objects.all()
        serializer = ExperienceSummarySerializer(experiences, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """Create a new experience."""
        serializer = ExperienceSummarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        """Update an existing experience by primary key."""
        try:
            experience = Experience.objects.get(pk=pk)
        except Experience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExperienceSummarySerializer(experience, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserInfoListCreateView(generics.ListCreateAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def post(self, request, *args, **kwargs):
        # Extract data from the request
        user_data = request.data


        print("DFdsfdsfdsddsdsdsdfsdd->>>>>>       ")
       

        # Validate that the data is in the correct format (if needed)
        if not isinstance(user_data, dict):
            return Response(
                {"error": "Invalid data format. The request body should be a dictionary."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the user already has an entry
        try:
            user_info_instance = UserInfo.objects.get(user=request.user)
            # Update the existing entry
            serializer = self.get_serializer(user_info_instance, data=user_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except UserInfo.DoesNotExist:
            # Create a new entry
            serializer = self.get_serializer(data=user_data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)

        # Return the serialized data for the updated or newly created instance
        return Response(serializer.data, status=status.HTTP_200_OK)




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
    




# import 
from rest_framework.exceptions import NotFound

class UserProfileImageDetailByIdView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):  # Use 'pk' to match the URL pattern
        try:
            profile = UserProfileImage.objects.get(user_id=pk)
        except UserProfileImage.DoesNotExist:
            raise NotFound({"error": "User profile image not found."})
        
        serializer = UserProfileImageSerializer(profile)
        return Response(serializer.data)


    







    