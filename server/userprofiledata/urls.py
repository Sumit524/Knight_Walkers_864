
from django.urls import path
from .views import UserDetailsView, UserDataCreateView,UserPreferencesCreateView,UserPreferencesDetailsView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('userdata/', UserDataCreateView.as_view(), name='userdata-create'),  # Corrected path for creating/listing user data
    path('userdata/<int:pk>/', UserDetailsView.as_view(), name='userdata-detail') , # Corrected path for retrieving/updating/deleting specific user data
    path('userpreferences/', UserPreferencesCreateView.as_view(), name='userpreferences'),
     path('userpreferences/<int:pk>/', UserPreferencesDetailsView.as_view(), name='userpreferences-detail'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# userprofiledata/userdata