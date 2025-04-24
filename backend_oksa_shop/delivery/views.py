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
    def get_queryset(self):
        # Возвращаем только те объекты Delivery, которые принадлежат текущему пользователю
        return Delivery.objects.filter(user=self.request.user)

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


class DeliveryWebhookView(APIView):
    def post(self, request):
        # Получаем данные из запроса
        payload = request.data
        print(request)
        return Response(42)

        # Проверяем, что это уведомление о статусе доставки
        # if 'event' in payload:
        #     delivery_object = payload['object']
        #     delivery_id = delivery_object['id']
        #
        #     # Обновляем статус доставки в базе данных
        #     try:
        #         delivery_model = DeliveryModel.objects.get(delivery_id=delivery_id)
        #         delivery_model.status = delivery_object['status']  # Обновляем статус на полученный
        #         delivery_model.save()
        #
        #         # Если доставка успешна, можно выполнить дополнительные действия
        #         if delivery_object['status'] == 'delivered':
        #             order = Order.objects.get(delivery=delivery_model)
        #             # Например, можно изменить статус заказа или выполнить другие действия
        #             order.status = 'completed'  # Обновляем статус заказа
        #             order.save()
        #
        #             # Дополнительно, если нужно, можно изменить доступность открыток
        #             postcards = order.postcards.all()
        #             for postcard in postcards:
        #                 postcard.available = False  # Или любое другое значение, которое вам нужно
        #                 postcard.save()
        #
        #         return Response(status=status.HTTP_200_OK)
        #     except DeliveryModel.DoesNotExist:
        #         return Response(status=status.HTTP_404_NOT_FOUND)
        #     except Order.DoesNotExist:
        #         return Response(status=status.HTTP_404_NOT_FOUND)

        # return Response(status=status.HTTP_400_BAD_REQUEST)