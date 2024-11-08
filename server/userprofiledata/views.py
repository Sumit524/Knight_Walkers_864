from django.shortcuts import render

# Create your views here.



from rest_framework import generics

from .models import UserData,UserPreferences
from .serializer import UserDataSerializer

from rest_framework import generics
from .models import UserData
from .serializer import UserDataSerializer
from rest_framework import generics
from .models import UserData
from .serializer import UserDataSerializer,UserPreferencesSerializer




from rest_framework.parsers import MultiPartParser, FormParser

class UserDataCreateView(generics.ListCreateAPIView):
    queryset = UserData.objects.all()  
    serializer_class = UserDataSerializer  # The serializer class to transform the model into JSON and vice versa



class UserDetailsView(generics.RetrieveUpdateDestroyAPIView):
     queryset = UserData.objects.all()
     serializer_class = UserDataSerializer
     parser_classes = (MultiPartParser, FormParser) 



class UserPreferencesCreateView(generics.ListCreateAPIView):
    queryset = UserPreferences.objects.all() 
    serializer_class = UserPreferencesSerializer  



class UserPreferencesDetailsView(generics.RetrieveUpdateDestroyAPIView):
       queryset = UserPreferences.objects.all() 
       serializer_class = UserPreferencesSerializer 
       parser_classes = (MultiPartParser, FormParser) 





