# payments/urls.py
from django.urls import path
from .views import CreatePaymentView, PaymentWebhookView

urlpatterns = [
    path('create/', CreatePaymentView.as_view(), name='create_payment'),
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
]