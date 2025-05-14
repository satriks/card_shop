# payments/views.py
import json

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from yookassa import Configuration, Payment, Webhook, Receipt

from delivery.sdek_api import SdekApiClient
from .models import Payment as PaymentModel
from delivery.serializers import DeliverySerializer
from .serializers import PaymentSerializer, ReceiverSerializer
from django.conf import settings
from cards.models import Postcard
from orders.serializers import OrderSerializer
from delivery.models import Delivery
from orders.models import Order
from backend.tasks import send_new_order_notification
from django_rq import job
import uuid
import logging
logger = logging.getLogger('shop')


Configuration.account_id = settings.YOOKASSA_SHOP_ID
Configuration.secret_key = settings.YOOKASSA_API_KEY


# Configuration.configure(secret_key = settings.YOOKASSA_API_KEY, account_id = settings.YOOKASSA_SHOP_ID)
class CreatePaymentView(APIView):
    def post(self, request):


        receiver = request.data.get('receiver')
        delivery = request.data.get('delivery')
        cart = request.data.get('cart')
        user = request.user
        delivery["delivery_cost"] = int(delivery["delivery_cost"])

        # Получение открыток по id
        cards = Postcard.objects.filter(id__in=cart)

        # Расчет стоимости открыток
        total_price = sum(card.price for card in cards)
        # Сумма заказа
        amount = total_price + int(delivery["delivery_cost"])

        # Собираем товары для чека
        items = []
        for card in cards:
            item = {
                "description": f'Открытка : "{card.title}"',
                "quantity": 1.000,
                "amount": {
                    "value": f"{card.price:.2f}",
                    "currency": "RUB"
                },
                "vat_code": 1,
                "payment_mode": "full_prepayment",
                "payment_subject": "commodity"
            }
            items.append(item)

        # Добавление доставку в чек
        if int(delivery["delivery_cost"]) > 0 :
            receipt_delivery = {
                                "description": "Доставка",
                                "quantity": 1.000,
                                "amount": {
                                    "value": f'{int(delivery["delivery_cost"]):.2f}',
                                    "currency": "RUB"
                                },
                                "vat_code": 1,
                                "payment_mode": "full_prepayment",
                                "payment_subject": "service",
                            }
            items.append(receipt_delivery)


        # Нужно убрать открытки из наличия, хотя это ноыерно лучше делать после оплаты ?






        delivery_serializer = DeliverySerializer(data=delivery)
        print(delivery_serializer.is_valid())
        if delivery_serializer.is_valid():
            if user  and user.is_authenticated:
                delivery_addres = Delivery.objects.get(delivery_name=delivery_serializer.validated_data["delivery_name"], user=user)

            else:
                if delivery_serializer.validated_data["delivery_name"] == "Самовывоз":
                    delivery_addres = Delivery.objects.get(
                        delivery_name=delivery_serializer.validated_data["delivery_name"], user=None)
                else :
                    delivery_addres = Delivery.objects.create(**delivery_serializer.validated_data)


        else:
            print(delivery_serializer.errors)




        idempotence_key = str(uuid.uuid4())
        payment = Payment.create({
            "amount": {
                "value": str(amount),
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": "http://localhost:5173/?confirm=true",
            },
            "capture": True,
            "description": "Payment for order",
            "metadata": {
                "webhook_url": "http://localhost:8000/payments/webhook/"
            },
            "receipt": {
                "customer": {
                    "email": receiver['email']
                },
                "items": items
            }
        }, idempotence_key)

        print(payment)
        # serializer(data={"payment_id" : payment.id})
        # payment_data = serializer.save()
        payment_serializer = PaymentSerializer(data={"payment_id": payment.id, "status" : payment.status , "amount" : amount, "idempotence_key" : idempotence_key})
        if payment_serializer.is_valid():  # Проверяем, валидны ли данные
            payment_data = payment_serializer.save()
            logger.info('Создан платеж в БД')# Сохраняем данные
        else:
            print("Ошибка в данных платежа:", payment_serializer.errors)
            logger.error(payment_serializer.errors)


        receiver_data = { "recipient_name" : receiver['name'], 'recipient_email': receiver['email'], 'recipient_phone': receiver['phone']}

        data_order = {

            **receiver_data,
            "delivery_status": "пока нет информации",
            "delivery" : delivery_addres,
            "payment_status": payment.status,
            "payment": payment_data,
            "postcards": cards
        }
        if (user and user.is_authenticated):
            data_order["user"]= user.id

        order_serializer = OrderSerializer(
            data=data_order)



        if order_serializer.is_valid():
            order = order_serializer.save()
            logger.info('Отравлена ссылка на оплату')
            return Response({"payment_url": payment.confirmation.confirmation_url}, status=status.HTTP_201_CREATED)

        logger.error('Ошибка при подготовке платежа')
        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        # return Response({"str":42})

class PaymentWebhookView(APIView):
    def post(self, request):
        # Получаем данные из запроса
        payload = request.data

        #обавить удаление открыток из наличия при успешной оплате

        # Проверяем, что это уведомление о статусе платежа
        if 'event' in payload:
            payment_object = payload['object']
            payment_id = payload['object']['id']
            # Обновляем статус платежа в базе данных
            try:
                payment_model = PaymentModel.objects.get(payment_id=payment_id)
                payment_model.status = payment_object['status']  # Обновляем статус на успешный
                payment_model.save()
                order = Order.objects.get(payment=payment_model)
                order.save()
                job = send_new_order_notification(order.id)
                if payment_object['status'] == 'succeeded':
                    postcards = order.postcards.all()
                    # Измените атрибут available для каждой открытки
                    for postcard in postcards:
                        postcard.available = False  # Или любое другое значение, которое вам нужно
                        postcard.save()

                    if not order.delivery.delivery_self:
                        sdek = SdekApiClient()
                        sdek.oreder(order)
                logger.info('Изменение статуса платежа')
                return Response(status=status.HTTP_200_OK)
            except PaymentModel.DoesNotExist:
                logger.error('Нет платежа в БД')
                return Response(status=status.HTTP_404_NOT_FOUND)
        logger.error('Запрос к БД без данных о оплате')
        return Response(status=status.HTTP_400_BAD_REQUEST)