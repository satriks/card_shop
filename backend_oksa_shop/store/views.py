from datetime import  timedelta

from django.shortcuts import redirect
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django_rq import job
from backend import settings
from backend.settings import BASE_HOST
from .models import CustomUser
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.exceptions import ValidationError
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from django.conf import settings
from backend.tasks import send_password_reset_email
from backend.tasks import send_registration_email
from django_rq import job
import logging
logger = logging.getLogger('shop')

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
        logger.info(f'User created {user.email}')


        # Получаем пользователя из базы данных
        user_instance = CustomUser.objects.get(email=email)

        # Отпавляем письмо регистрации
        job = send_registration_email(user_instance.id)

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
            logger.info(f'Пользователь изменил данные {user.email}')
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(f'Обшибка при изменении данных {user.email}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    pass


class ConfirmEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return redirect(f"{settings.BASE_HOST}/?error=invalid_link")  # Замените на ваш URL главной страницы
        if user is not None and default_token_generator.check_token(user, token):
            user.email_verified = True
            user.save()
            logger.info(f'{user.email} подтвердил почту')
            response = redirect(settings.BASE_HOST)  # Замените на ваш URL главной страницы
            # response.set_cookie('_wp_kcrt', user.access_token)  # Устанавливаем cookie с access token
            return response
        else:
            return redirect(f"{settings.BASE_HOST}/?error=invalid_token")


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            base_url = settings.BASE_HOST
            user = CustomUser.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{base_url}/api/password_reset/confirm/{uid}/{token}/"
            job = send_password_reset_email(user.id, reset_link)
            logger.info(f'User {user.email} запросил ссылку на смену пароля ссылка: {reset_link}')
            return Response({"message": "Ссылка для восстановления пароля отправлена на вашу почту."}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            logger.error(f'Запрос на сброс пароля незарегестрированного пользователя')
            return Response({"error": "Пользователь с таким email не найден."}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return redirect(f"{settings.BASE_HOST}/?error=invalid_link")  # Замените на ваш URL главной страницы
        if user is not None and default_token_generator.check_token(user, token):
            # user.email_verified = True
            token = CustomTokenObtainPairSerializer.get_token(user)
            print(token)
            # response = redirect(f"{settings.BASE_HOST}/?user={token}&reset=1")
            # Замените на ваш URL главной страницы
            logger.info(f'Пользователь {user.email} перешел по ссылке восстановленя пароля')
            url = "http://localhost:5173/"
            response = redirect(f"{url}/?user={token}&reset=1")
            # response.set_cookie('_wp_kcrt', user.access_token)  # Устанавливаем cookie с access token
            return response
        else:
            return redirect(f"{settings.BASE_HOST}/?error=invalid_token")