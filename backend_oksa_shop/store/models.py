from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(unique=True)  # Убедитесь, что email уникален
    username = None  # Убираем поле username
    USERNAME_FIELD = 'email'  # Установите email как поле для аутентификации
    REQUIRED_FIELDS = []
    objects = UserManager()# Оставьте пустым, если не хотите, чтобы другие поля были обязательными

    def __str__(self):
        return self.email


#Доставка и хранение адресов
class Address(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses')
    address_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True, null=True)  # Необязательное поле
    additional_info = models.TextField(blank=True, null=True)  # Более точные данные адреса
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.address_name}, {self.city}, {self.street}, {self.postal_code or 'No postal code'}"


#Оплата и карты


#Заказы и  История заказов
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'В ожидании'),
        ('processing', 'В обработке'),
        ('completed', 'Завершен'),
        ('canceled', 'Отменен'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.ForeignKey(Address, on_delete=models.PROTECT)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username} - Status: {self.status}"