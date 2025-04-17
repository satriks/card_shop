from django.db import models

# Create your models here.
from django.db import models
class Payment(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    idempotence_key = models.CharField(max_length=120, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_id = models.CharField(max_length=100, unique=True)