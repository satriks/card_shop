from datetime import  timedelta
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser
from .serializers import UserSerializer, CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    # Здесь можно переопределить методы, если нужно
    # def post(self, request, *args, **kwargs):
    #     # Получаем ответ от родительского метода
    #     response = super().post(request, *args, **kwargs)
    #
    #     # Получаем refresh токен из ответа
    #     refresh_token = response.data['refresh']
    #
    #     # Устанавливаем cookie с refresh токеном
    #     expires = timezone.now() + timedelta(days=7)  # Установите срок действия cookie
    #     response.set_cookie(
    #         key='Kailin_card_rt',
    #         value=refresh_token,
    #         # httponly=True,  # Запретить доступ к cookie через JavaScript
    #         # secure=False,  # Используйте True, если у вас HTTPS
    #         # samesite='Lax',
    #         expires=expires
    #     )
    #
    #     return response

class CustomTokenRefreshView(TokenRefreshView):

    pass

    # @method_decorator(csrf_exempt)  # Если вы используете CSRF, уберите эту строку
    # def post(self, request, *args, **kwargs):
    #     # Извлекаем refresh токен из cookie
    #     refresh = request.COOKIES.get('Kailin_card_rt')  # Замените на имя вашего cookie
    #     print(request.COOKIES)
    #     print(refresh, "это рефреш из куки")  # Для отладки
    #     if not refresh:
    #         return Response({'detail': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
    #
    #     # Обновляем токен, используя стандартную логику
    #     data = {'refresh': refresh}  # Создаем словарь с refresh токеном
    #     try:
    #         # Используем метод super() для обновления токена
    #         response = super().post(request, data=data, *args, **kwargs)
    #     except Exception as e:
    #         return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    #
    #     return response