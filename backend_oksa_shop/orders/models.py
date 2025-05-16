from django.db import models
from django.conf import settings
from delivery.models import Delivery
from payments.models import Payment
from cards.models import Postcard

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)  # Поле для пользователя

    recipient_name = models.CharField(max_length=100)
    recipient_phone = models.CharField(max_length=15)
    recipient_email = models.EmailField()

    delivery_status = models.CharField(max_length=50)
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)

    sdek_id = models.CharField(max_length=100, null=True, blank=True)
    sdek_number = models.CharField(max_length=50, null=True, blank=True)

    payment_status = models.CharField(max_length=20)
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True)

    postcards = models.ManyToManyField(Postcard, related_name='orders', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def postcards_total(self):
        postcards_cost  = sum(postcard.price for postcard in self.postcards.all())
        delivery_cost = self.delivery.delivery_cost if self.delivery and (self.delivery.delivery_cost is not None) else 0
        return postcards_cost + delivery_cost

    def save(self, *args, **kwargs):
        # postcards_total = sum(postcard.price for postcard in self.postcards.all())  # Сумма цен открыток
        # delivery_cost = self.delivery.delivery_cost if self.delivery else 0  # Стоимость доставки
        # self.total = postcards_total + delivery_cost
        if self.payment_id:
            self.payment_status = self.payment.status  # Предполагается, что в модели Payment есть поле status
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.id} - {self.recipient_name}"