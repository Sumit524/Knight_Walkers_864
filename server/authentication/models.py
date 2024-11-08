from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import uuid
from django.db import models
from django.contrib.auth.hashers import make_password


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hash the password using Django's built-in method
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser with an email, password, and extra fields."""
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


# class CustomUser(AbstractBaseUser):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # Unique UUID for each user
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=128)
#     date_joined = models.DateTimeField(auto_now_add=True)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     is_superuser = models.BooleanField(default=False)

#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = []  # 'email' is not required here since it's the username field

#     objects = CustomUserManager()

#     def __str__(self):
#         return self.email

#     # These methods are required for compatibility with Django's authentication system
#     @property
#     def is_anonymous(self):
#         return False

#     @property
#     def is_authenticated(self):
#         return True

#     def get_full_name(self):
#         return self.email

#     def get_short_name(self):
#         return self.email



from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
import uuid

# Custom Manager for CustomUser
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # UUID as primary key
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Email is required because it's the username field

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    # These methods are required for compatibility with Django's authentication system
    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def has_perm(self, perm, obj=None):
        """
        Check if the user has a specific permission.
        """
        # You can add custom permission logic here, e.g., check for user group permissions
        return True

    def has_module_perms(self, app_label):
        """
        Check if the user has permissions for a specific app.
        """
        # You can add custom logic to check if the user has module-level permissions
        return True

