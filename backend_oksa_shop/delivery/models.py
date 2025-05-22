from django.conf import settings
from django.db import models
class Delivery(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='deliveries', null=True, blank=True, verbose_name='Пользователь')
    delivery_self = models.BooleanField(default=False, verbose_name='Самовывоз')
    delivery_address = models.JSONField(null=True, blank=True, verbose_name='Адрес доставки')
    delivery_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Стоимость доставки')
    delivery_office = models.CharField(max_length=100, null=True, blank=True, verbose_name='Офис доставки')
    delivery_tariff_code = models.CharField(max_length=50, null=True, blank=True, verbose_name='Код тарифа доставки')
    delivery_name = models.CharField(max_length=100, null=True, blank=True, verbose_name='Название доставки')
    delivery_office_detail = models.JSONField(null=True, blank=True, verbose_name='Детали офиса доставки')
    min_delivery_time = models.PositiveIntegerField(null=True, blank=True, verbose_name='Минимальное время доставки')
    max_delivery_time = models.PositiveIntegerField(null=True, blank=True, verbose_name='Максимальное время доставки')
    def __str__(self):
        return f"Delivery {self.id} - {self.delivery_name or 'Unnamed'}"
    class Meta:
        verbose_name = 'Доставка'
        verbose_name_plural = 'Доставки'