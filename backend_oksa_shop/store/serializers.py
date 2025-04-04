from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'middle_name', 'last_name', 'email', 'password', 'phone_number', 'is_staff')
        extra_kwargs = {
            'password': {'write_only': True}  # Скрыть пароль при выводе
        }
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
    def update(self, instance, validated_data):
        # instance.name = validated_data.get('name', instance.name)
        # validated_data.update(instance)

        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.middle_name = validated_data.get('middle_name', instance.middle_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.email = validated_data.get('email', instance.email)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        if validated_data.get('password') is not None:
            instance.set_password(validated_data.get('password'))
        instance.save()

        return instance




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