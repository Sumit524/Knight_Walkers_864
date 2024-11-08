from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser  # Import the correct custom user model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Ensure the password is hashed using set_password
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password', 'date_joined', 'is_active']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Hash the password when creating a user
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)  # Use set_password for hashing
        user.save()
        return user

    def update(self, instance, validated_data):
        # Hash password if it's being updated
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))  # Hash the updated password
        return super().update(instance, validated_data)




from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser  # Assuming CustomUser is your custom user model

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Extract email and password from attrs
        email = attrs.get('email')
        password = attrs.get('password')

        # Check if the user exists with the given email
        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError('User with this email does not exist.')

        # Check if the password matches
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid password.')

        # Attach the user object to attrs so it's available for token creation
        attrs['user'] = user

        # Call the superclass method to create the token
        return super().validate(attrs)


