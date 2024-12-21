from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')



from rest_framework import serializers
from .models import UserInfo,UserPreference


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

         