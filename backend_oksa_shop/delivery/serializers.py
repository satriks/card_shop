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

        if user is None:
            delivery = Delivery.objects.create(**validated_data)
            # raise serializers.ValidationError("Пользователь не аутентифицирован.")
        else:
            delivery = Delivery.objects.create(user=user, **validated_data)
        return delivery