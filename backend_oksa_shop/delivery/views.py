from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from backend.decorators import cache_response
from .sdek_api import SdekApiClient
from rest_framework import generics
from .models import Delivery
from .serializers import DeliverySerializer
from orders.models import Order

status_dict = {
    "CREATED": "Заказ зарегистрирован в базе данных СДЭК",
    "REMOVED": "Заказ отменен ИМ после регистрации в системе до прихода груза на склад СДЭК в городе-отправителе",
    "RECEIVED_AT_SHIPMENT_WAREHOUSE": "Оформлен приход на склад СДЭК в городе-отправителе",
    "READY_TO_SHIP_AT_SENDING_OFFICE": "Выдан на отправку в г. отправителе",
    "READY_FOR_SHIPMENT_IN_TRANSIT_CITY": "Выдан на отправку в г. отправителе",
    "RETURNED_TO_SENDER_CITY_WAREHOUSE": "Возвращен на склад отправителя",
    "PASSED_TO_CARRIER_AT_SENDING_OFFICE": "Сдан перевозчику в г. отправителе",
    "SEND_TO_TRANSIT_OFFICE": "Отправлен в г. транзит",
    "MET_AT_TRANSIT_OFFICE": "Встречен в г. транзите",
    "ACCEPTED_AT_TRANSIT_WAREHOUSE": "Принят на склад транзита",
    "RETURNED_TO_TRANSIT_WAREHOUSE": "Возвращен на склад транзита",
    "READY_TO_SHIP_IN_TRANSIT_OFFICE": "Выдан на отправку в г. транзите",
    "PASSED_TO_CARRIER_AT_TRANSIT_OFFICE": "Сдан перевозчику в г. транзите",
    "SENT_TO_SENDER_CITY": "Отправлен в г. отправитель",
    "MET_AT_SENDING_OFFICE": "Встречен в г. отправителе",
    "MET_AT_RECIPIENT_OFFICE": "Встречен в г. получателе",
    "ACCEPTED_AT_RECIPIENT_CITY_WAREHOUSE": "Принят на склад доставки",
    "ACCEPTED_AT_PICK_UP_POINT": "Принят на склад до востребования",
    "TAKEN_BY_COURIER": "Выдан на доставку",
    "RETURNED_TO_RECIPIENT_CITY_WAREHOUSE": "Возвращен на склад доставки",
    "DELIVERED": "Вручен",
    "NOT_DELIVERED": "Не вручен",
    "ENTERED_TO_OFFICE_TRANSIT_WAREHOUSE": "Поступил в г. транзита",
    "ENTERED_TO_DELIVERY_WAREHOUSE": "Поступил на склад доставки",
    "ENTERED_TO_WAREHOUSE_ON_DEMAND": "Поступил на склад до востребования",
    "IN_CUSTOMS_INTERNATIONAL": "Таможенное оформление в стране отправления",
    "SHIPPED_TO_DESTINATION": "Отправлено в страну назначения",
    "PASSED_TO_TRANSIT_CARRIER": "Передано транзитному перевозчику",
    "IN_CUSTOMS_LOCAL": "Таможенное оформление в стране назначения",
    "CUSTOMS_COMPLETE": "Таможенное оформление завершено",
    "POSTOMAT_POSTED": "Заложен в постамат",
    "POSTOMAT_SEIZED": "Изъят из постамата курьером",
    "POSTOMAT_RECEIVED": "Изъят из постамата клиентом",
    "READY_FOR_SHIPMENT_IN_SENDER_CITY": "Готов к отправке в городе отправителе",
    "TAKEN_BY_TRANSPORTER_FROM_SENDER_CITY": "Сдан перевозчику в городе отправителе",
    "SENT_TO_TRANSIT_CITY": "Отправлен в город-транзит",
    "ACCEPTED_IN_TRANSIT_CITY": "Встречен в городе-транзите",
    "TAKEN_BY_TRANSPORTER_FROM_TRANSIT_CITY": "Сдан перевозчику в городе-транзите",
    "SENT_TO_RECIPIENT_CITY": "Отправлен в город-получатель",
    "ACCEPTED_IN_RECIPIENT_CITY": "Встречен в городе-получателе"
}

class DeliveryListCreateView(generics.ListCreateAPIView):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        # cache_key = f'delivery_list_{self.request.user.id}'
        # cached_data = cache.get(cache_key)
        # if cached_data is not None:
        #     return cached_data
        # Возвращаем только те объекты Delivery, которые принадлежат текущему пользователю
        queryset  =  Delivery.objects.filter(user=self.request.user)
        # cache.set(cache_key, queryset, timeout=60)
        return queryset
    # @cache_response(timeout=60)  # Используем декоратор



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
    def perform_destroy(self, instance):
        # Проверяем, принадлежит ли адрес текущему пользователю
        if instance.user == self.request.user:  # Предполагается, что у вас есть поле user в модели Delivery
            instance.delete()
        else:
            # Если адрес не принадлежит текущему пользователю, возвращаем ошибку
            return Response({'detail': 'У вас нет прав для удаления этого адреса.'}, status=status.HTTP_403_FORBIDDEN)

class CityView(APIView):

    def get(self, request):
        """Получение информации о городе по его названию."""
        city_name = request.GET.get('city_name')
        sdek_client = SdekApiClient()
        cache_city = cache.get(city_name)
        if cache_city is not None:
            city_data = cache_city
        else :
            city_data = sdek_client.get_city(city_name)
            cache.set(city_name, city_data, timeout=60)
        if city_data is not None:
            return Response(city_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Не удалось получить данные о городе."}, status=status.HTTP_400_BAD_REQUEST)

class CityDetailView(APIView):
    @cache_response(timeout=60)
    def get(self, request):
        sdek_client = SdekApiClient()  # Создаем экземпляр клиента
        city_code = request.GET.get('city_code')
        city_data = sdek_client.get_city_detail(city_code)
        if city_data is not None:
            return Response(city_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Не удалось получить данные о городе."}, status=status.HTTP_400_BAD_REQUEST)


class OfficeView(APIView):
    @cache_response(timeout=60)
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
    @cache_response(timeout=60)
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


class DeliveryWebhookView(APIView):
    def post(self, request):
        # Получаем данные из запроса
        payload = request.data
        #logger
        try :
            order = Order.objects.get(sdek_id=payload['uuid'])
            order.sdek_number = payload['attributes']['number']
            order.delivery_status = status_dict[payload['attributes']['code']]
            order.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


