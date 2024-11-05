from django.urls import path
from . import views

urlpatterns = [
    path('getcoordinates/', views.search_nearby_locations),
]
