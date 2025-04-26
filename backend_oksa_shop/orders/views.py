from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from backend.decorators import cache_response
from .models import Order
from .serializers import OrderSerializer


# Create your views here.
class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        # Возвращаем только те объекты Delivery, которые принадлежат текущему пользователю
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    @cache_response(timeout=60)  # Используем декоратор
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)