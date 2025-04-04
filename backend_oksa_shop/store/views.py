from datetime import  timedelta
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from .models import CustomUser
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.exceptions import ValidationError


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        # Проверка на существование пользователя с таким же email
        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError({"email": "Пользователь с таким адресом электронной почты уже существует."})

        # Создание нового пользователя
        user = super().create(request, *args, **kwargs).data

        # Получаем пользователя из базы данных
        user_instance = CustomUser.objects.get(email=email)

        # Генерация токенов
        refresh = RefreshToken.for_user(user_instance)
        access = str(refresh.access_token)
        # Формируем ответ
        response_data = {
            'user': user,
            'refresh': str(refresh),
            'access': access,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)  # Используем сериализатор для возврата данных пользователя
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        new_password = request.data.get("password", None)
        # Если новый пароль предоставлен, устанавливаем его
        if new_password:
            user.set_password(new_password)  # Устанавливаем новый пароль
        # Создаем сериализатор для обновления данных пользователя
        serializer = UserSerializer(user, data=request.data,
                                    partial=True)  # Используем partial=True для частичного обновления
        if serializer.is_valid():
            serializer.save()  # Сохраняем обновленные данные
            user.save()  # Сохраняем изменения пользователя
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    pass


