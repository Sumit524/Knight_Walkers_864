from django.shortcuts import render

# Create your views here.
import requests
from django.http import JsonResponse
from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import api_view

def search_nearby_locations(request):
    # Example user preferences
    
    params = {
        'categories': 'entertainment.museum',
        # 'conditions': 'vegetarian',
        'filter': 'circle:80.93795405061269,26.84033392181192,10000',
        'bias' : 'proximity:80.93795405061269,26.84033392181192',
        'limit': 20,
        'apiKey': settings.GEOAPIFY_API_KEY  # Replace with your actual API key
    }
  
    # Geoapify API endpoint for places
    api_url = "https://api.geoapify.com/v2/places"

    print("\n Request Parameters \n:", params)  # Debugging: Print request parameters
    print("\n")

    # Make the request to Geoapify API
    response = requests.get(api_url, params=params)

    # Check for response status and handle errors
    if response.status_code != 200:
        print("Error response:", response.json())  # Debugging: Print error response
        return JsonResponse({'error': 'Error fetching data from Geoapify'}, status=response.status_code)

    data = response.json()
    # print("API Response Data:", data)  # Debugging: Print API response data

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

# views.py

# from django.contrib.gis.geos import Point
# from django.shortcuts import render
# from .models import UserLocation, Interest

# def update_location(request):
#     if request.method == 'POST':
#         location_lat = request.POST.get('latitude')
#         location_lon = request.POST.get('longitude')
#         range_radius = request.POST.get('range_radius')

#         location, created = UserLocation.objects.update_or_create(
#             user=request.user,
#             defaults={
#                 'location': Point(float(location_lon), float(location_lat)),
#                 'range_radius': int(range_radius),
#             }
#         )
#         return render(request, 'location_updated.html')

# def update_interest(request):
#     if request.method == 'POST':
#         interest_name = request.POST.get('interest')
#         Interest.objects.update_or_create(user=request.user, interest_name=interest_name)
#         return render(request, 'interest_updated.html')
