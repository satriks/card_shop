from django.db import models
from django.conf import settings


class Delivery(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='deliveries')
    delivery_self = models.BooleanField(default=False)
    delivery_address = models.JSONField(null=True, blank=True)
    delivery_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    delivery_office = models.CharField(max_length=100, null=True, blank=True)
    delivery_tariff_code = models.CharField(max_length=50, null=True, blank=True)
    delivery_name = models.CharField(max_length=100, null=True, blank=True)
    delivery_office_detail = models.JSONField(null=True, blank=True)
    min_delivery_time = models.PositiveIntegerField(null=True, blank=True)
    max_delivery_time = models.PositiveIntegerField(null=True, blank=True)
    def __str__(self):
        return f"Delivery {self.id} - {self.delivery_name or 'Unnamed'}"