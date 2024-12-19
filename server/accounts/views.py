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






