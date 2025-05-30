from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from .models import Delivery
class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        exclude = ['user']
        # fields = '__all__'

    def create(self, validated_data):
        user = None
        user_data = self.context.get("request")

        if user_data is not None:
            user = self.context['request'].user
        # проверка на повторное создание
        try:
            delivery_check = Delivery.objects.get(user=user, delivery_name=validated_data['delivery_name'])
        except ObjectDoesNotExist:
            delivery_check = None
        print(delivery_check)
        if delivery_check is not None:
            return delivery_check

        if user is None:
            delivery = Delivery.objects.create(**validated_data)
            # raise serializers.ValidationError("Пользователь не аутентифицирован.")
        else:
            delivery = Delivery.objects.create(user=user, **validated_data)
        return delivery