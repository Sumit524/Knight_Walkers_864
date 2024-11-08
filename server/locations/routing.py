
from django.urls import path
from . import consumers  # Import your consumer

websocket_urlpatterns = [
    path('ws/match/', consumers.MatchConsumer.as_asgi()),  # Route to the MatchConsumer
]
