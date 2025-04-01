from django.urls import path
from .views import CityView, OfficeView, TariffView, CityDetailView, DeliveryListCreateView, DeliveryDetailView

urlpatterns = [
    path('deliveries/', DeliveryListCreateView.as_view(), name='delivery-list-create'),
    path('deliveries/<int:pk>/', DeliveryDetailView.as_view(), name='delivery-detail'),
    path('city/', CityView.as_view(), name='get_city'), # Получение информации о городе
    path('city/detail/', CityDetailView.as_view(), name='get_city'),
    path('offices/', OfficeView.as_view(), name='get_offices'),  # Получение офисов по коду города
    path('tariff/', TariffView.as_view(), name='calculate_tariff'),  # Расчет стоимости доставки
]