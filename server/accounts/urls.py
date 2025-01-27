from rest_framework_simplejwt import views as jwt_views
from django.urls import path
from .views import UserInfoDetailsView, UserInfoListCreateView,UserProfileImageDetailView, SelectPreferenceCreateView,SelectPreferenceDetailsView,UserProfileImageView,UserProfileImageDetailByIdView,ExperienceView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # JWT token obtain and refresh endpoints
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    # Your custom views for user info
    path('userinfo/', UserInfoListCreateView.as_view(), name="user-info-create"),
   
    path('userinfo/<int:pk>/', UserInfoDetailsView.as_view(), name="user-details"),

    path('userinfo/<int:pk>/', UserInfoDetailsView.as_view(), name="user-details"),
     path('preferences/', SelectPreferenceCreateView.as_view(), name='preferences-list-create'),

    # URL for retrieving, updating, and deleting a specific preference
    path('preferences/<int:user_id>/', SelectPreferenceDetailsView.as_view(), name='preferences-detail-by-user'),
    #  path('profile/', UserProfileImageCreateView.as_view(), name='user-profile'),
     path('profileImage/<int:pk>/', UserProfileImageDetailByIdView.as_view(), name='user-detail-profile'),
       path('profileImage/', UserProfileImageView.as_view(), name='user-profile'),
          path('profileImage/detail/', UserProfileImageDetailView.as_view(), name='user-profile-detail'),

          path('experience/', ExperienceView.as_view(),name ="user-experience"),  # For GET and POST
    path('experience/<int:pk>/',ExperienceView.as_view(),name ="user-experience-details"),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)