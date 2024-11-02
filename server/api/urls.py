from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world),
    path('locations/', views.search_nearby_locations, name='search_nearby_locations'),
]
