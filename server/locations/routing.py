
from django.urls import path
from . import consumers  # Import your consumer

websocket_urlpatterns = [
    path('ws/match/<int:id>/', consumers.MatchConsumer.as_asgi()),  # Route to the MatchConsumer
]
