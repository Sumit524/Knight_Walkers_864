"""
ASGI config for server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

django.setup()  # This line ensures the app registry is loaded before importing other modules

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chatify.routing import websocket_urlpatterns as chat_websocket_urlpatterns
from locations.routing import websocket_urlpatterns as location_websocket_urlpatterns

# application = get_asgi_application()

print("asgi.py main project line 21")
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            # chatify.routing.websocket_urlpatterns + locations.routing.websocket_urlpatterns
            chat_websocket_urlpatterns + location_websocket_urlpatterns
            )
    ),
})

