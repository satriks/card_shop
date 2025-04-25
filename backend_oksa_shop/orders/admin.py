from django.contrib import admin

from orders.models import Order

# Register your models here.
# admin.site.register(Order)


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient_name', 'recipient_phone', 'recipient_email', 'delivery_status', 'payment_status',
                    'postcards_total')

    # Если вы хотите, чтобы postcards_total был кликабельным и вёл на детальную страницу заказа
    def postcards_total(self, obj):
        return obj.postcards_total

    postcards_total.short_description = 'Общая стоимость'  # Название колонки в админке


admin.site.register(Order, OrderAdmin)