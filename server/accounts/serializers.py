from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserInfo,UserPreference,UserProfileImage
User = get_user_model()
class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')






class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo  
        fields = '__all__' 




class SelectedOptionsSerializer(serializers.ModelSerializer):
    selected_categories = serializers.JSONField()  # Stores the selected categories with options

    class Meta:
        model = UserPreference
        fields = ['user', 'selected_categories']

    def update(self, instance, validated_data):
        instance.selected_categories = validated_data.get('selected_categories', instance.selected_categories)
        instance.save()
        return instance




class UserProfileImageSerializer(serializers.ModelSerializer):
     profile_image_url = serializers.SerializerMethodField()

     class Meta:
        model = UserProfileImage
        fields = ['user', 'profile_image', 'profile_image_url']
        extra_kwargs = {
            'user': {'read_only': True},
        }

     def get_profile_image_url(self, obj):
        """
        Return the full URL for the profile image.
        """
        request = self.context.get('request')
        if obj.profile_image and request:
            return request.build_absolute_uri(obj.profile_image.url)
        return None