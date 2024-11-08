from rest_framework import serializers
from .models import UserData,UserPreferences

class UserDataSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)  # Allow optional profile image during updates

    class Meta:
        model = UserData
        fields = '__all__'

    def validate(self, data):
        # Require `profile_image` only on creation (when instance is None)
        if self.instance is None and not data.get('profile_image'):
            raise serializers.ValidationError({"profile_image": "This field is required."})
        return data
    
class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
       model = UserPreferences
       fields ='__all__'   
    
    
