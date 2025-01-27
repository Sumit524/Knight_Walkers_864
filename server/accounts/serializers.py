from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserInfo,UserPreference,UserProfileImage,Experience
User = get_user_model()
class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')






class UserInfoSerializer(serializers.ModelSerializer):

    # The Meta class is a special class inside the serializer that provides configuration about how the serializer should work.

    # '__all__' is a special value that means all the fields of the model should be included.
    class Meta:
        model = UserInfo
        fields = ['first_name', 'last_name', 'gender', 'dob', 'contact', 'address', 'about']

    def validate(self, data):
        """
        Add any additional custom validations here if necessary.
        """
        # Ensure dob is in a correct format, or any other custom logic
        return data

        



class ExperienceSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'  # Use quotes for '__all__'

    def validate(self, data):
        """
        Add any additional custom validations here if necessary.
        """
        # Example custom validation (you can remove this block if unnecessary)
        if data.get('stars') and (data['stars'] < 1 or data['stars'] > 5):
            raise serializers.ValidationError("Stars must be between 1 and 5.")
        return data




# Serializer for the UserInfoTemp model
class UserInfoSerializerTemp(serializers.ModelSerializer):
     class Meta:
        model = UserInfo
        fields = ['first_name', 'last_name', 'gender', 'dob', 'contact', 'address', 'about']

     def validate(self, data):
        """
        Add any additional custom validations here if necessary.
        """
        # Ensure dob is in a correct format, or any other custom logic
        return data





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