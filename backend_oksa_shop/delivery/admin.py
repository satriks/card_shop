from django.contrib import admin
from .models import Delivery
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'delivery_name', 'delivery_cost',)
    list_filter = ('delivery_self',)
    search_fields = ('delivery_name', 'user__username')  # Поиск по имени доставки и имени пользователя
    ordering = ('-id',)
    readonly_fields = ('id',)  # Поле id только для чтения
admin.site.register(Delivery, DeliveryAdmin)