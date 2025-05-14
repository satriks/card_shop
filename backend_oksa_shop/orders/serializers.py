from rest_framework import serializers
from .models import Order
from delivery.serializers import DeliverySerializer
from cards.serializers import PostcardSerializer
from payments.serializers import PaymentSerializer
import logging
logger = logging.getLogger('shop')

class OrderSerializer(serializers.ModelSerializer):
    postcards = PostcardSerializer(many=True, read_only=True )
    delivery = DeliverySerializer(read_only=True)
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'recipient_name',
            'recipient_phone',
            'recipient_email',
            'delivery_status',
            'delivery',
            'payment_status',
            'payment',
            'postcards',
            'created_at',
            "postcards_total",
        ]

    def create(self, validated_data):
         # Извлекаем данные открыток
        order = Order(**validated_data)
        order.save()
        print(order.postcards)
        order.delivery = self.initial_data['delivery']
        order.postcards.set(self.initial_data['postcards'])
        order.payment = self.initial_data['payment']
        order.save()
        logger.info(f'Создан новый заказ {order.id}')

        return order

    def update(self, instance, validated_data):
        postcards_data = validated_data.pop('postcards', None)
        instance.recipient_name = validated_data.get('recipient_name', instance.recipient_name)
        instance.recipient_phone = validated_data.get('recipient_phone', instance.recipient_phone)
        instance.recipient_email = validated_data.get('recipient_email', instance.recipient_email)
        instance.delivery_status = validated_data.get('delivery_status', instance.delivery_status)
        instance.payment_status = validated_data.get('payment_status', instance.payment_status)
        instance.save()
        logger.info(f'Изменения в заказе {instance.id}')
        if postcards_data is not None:
            instance.postcards.set(postcards_data)
        return instance