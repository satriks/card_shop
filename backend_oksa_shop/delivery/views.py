from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .sdek_api import SdekApiClient
from rest_framework import generics
from .models import Delivery
from .serializers import DeliverySerializer


class DeliveryListCreateView(generics.ListCreateAPIView):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

class DeliveryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]
    def get_serializer_context(self):
        # Получаем базовый контекст
        context = super().get_serializer_context()
        # Добавляем текущего пользователя в контекст
        context['request'] = self.request
        return context


class CityView(APIView):
    def get(self, request):
        """Получение информации о городе по его названию."""
        sdek_client = SdekApiClient()  # Создаем экземпляр клиента
        city_name = request.GET.get('city_name')
        city_data = sdek_client.get_city(city_name)
        if city_data is not None:
            return Response(city_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Не удалось получить данные о городе."}, status=status.HTTP_400_BAD_REQUEST)

class CityDetailView(APIView):
    def get(self, request):
        sdek_client = SdekApiClient()  # Создаем экземпляр клиента
        city_code = request.GET.get('city_code')
        city_data = sdek_client.get_city_detail(city_code)
        if city_data is not None:
            return Response(city_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Не удалось получить данные о городе."}, status=status.HTTP_400_BAD_REQUEST)


class OfficeView(APIView):
    def get(self, request):
        """Получение офисов по коду города."""
        sdek_client = SdekApiClient()
        city_code = request.GET.get('city_code')# Создаем экземпляр клиента
        offices_data = sdek_client.get_offices(city_code)
        if offices_data is not None:
            return Response(offices_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Не удалось получить данные об офисах."}, status=status.HTTP_400_BAD_REQUEST)
class TariffView(APIView):
    def get(self, request):
        """Расчет стоимости доставки."""
        city_code = request.GET.get('city_code')
        # from_city_code = request.data.get('from_city_code')
        # to_city_code = request.data.get('to_city_code')
        # weight = request.data.get('weight')
        sdek_client = SdekApiClient()  # Создаем экземпляр клиента
        tariff_data = sdek_client.get_tarifflist(city_code)
        if tariff_data is not None:
            [print(x) for x in tariff_data['tariff_codes']]
            tarrifs = [tariff for tariff in tariff_data['tariff_codes'] if tariff["tariff_code"] in [483,482,136 ,137]]
            return Response(tarrifs, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Не удалось рассчитать тариф."}, status=status.HTTP_400_BAD_REQUEST)