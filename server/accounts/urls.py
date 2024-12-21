from rest_framework_simplejwt import views as jwt_views
from django.urls import path
from .views import UserInfoDetailsView, UserInfoListCreateView, SelectPreferenceCreateView,SelectPreferenceDetailsView

urlpatterns = [
    # JWT token obtain and refresh endpoints
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    # Your custom views for user info
    path('userinfo/', UserInfoListCreateView.as_view(), name="user-info-create"),
    path('userinfo/<int:pk>/', UserInfoDetailsView.as_view(), name="user-details"),
     path('preferences/', SelectPreferenceCreateView.as_view(), name='preferences-list-create'),

    # URL for retrieving, updating, and deleting a specific preference
    path('preferences/<int:user_id>/', SelectPreferenceDetailsView.as_view(), name='preferences-detail-by-user'),
]
