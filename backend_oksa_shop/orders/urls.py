# payments/urls.py
from django.urls import path

from orders.views import OrderListCreateView

urlpatterns = [
    path('get/', OrderListCreateView.as_view(), name='get_orders'),
]