from django.core.cache import cache
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response

from backend.decorators import cache_response
from .models import Postcard, Gallery
from .serializers import PostcardSerializer
import logging
logger = logging.getLogger('shop')

class PostcardViewSet(viewsets.ModelViewSet):
    queryset = Postcard.objects.all()
    serializer_class = PostcardSerializer
    def create(self, request, *args, **kwargs):
        # Сначала создаем объект Postcard
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        postcard = serializer.save()
        logger.info(f'Добаляем открытку {postcard.title}')
        # Сохраняем объект, чтобы получить его ID
        # Сохраняем изображения, если они были переданы
        images = request.FILES.getlist('images')  # Получаем список загруженных изображений
        for image in images:
            Gallery.objects.create(image=image, product=postcard)  # Создаем объект Gallery
        # Возвращаем ответ с сериализованным объектом Postcard
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    @cache_response(timeout=60)  # Используем декоратор
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
