from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'patronymic', 'last_name', 'email', 'password', 'phone_number', 'is_staff')
        extra_kwargs = {
            'password': {'write_only': True}  # Скрыть пароль при выводе
        }
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)  # Обязательное поле для email
    password = serializers.CharField(required=True)  # Обязательное поле для пароля

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        # Аутентификация по электронной почте
        user = authenticate(request=self.context.get('request'), username=email, password=password)
        if user is None:
            raise serializers.ValidationError(_('Неверные учетные данные'))
        attrs['user'] = user
        return super().validate(attrs)