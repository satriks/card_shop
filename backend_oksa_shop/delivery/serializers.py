from rest_framework import serializers
from .models import Delivery
class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        exclude = ['user']
        # fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        if user is None:
            raise serializers.ValidationError("Пользователь не аутентифицирован.")
        # Создаем новый объект Delivery с установленным полем user
        delivery = Delivery.objects.create(user=user, **validated_data)
        return delivery