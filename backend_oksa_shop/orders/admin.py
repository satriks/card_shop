from django.contrib import admin

from orders.models import Order

# Register your models here.
# admin.site.register(Order)


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient_name', 'recipient_phone', 'recipient_email', 'delivery_status', 'payment_status',
                    'postcards_total', )
    list_filter = ('payment_status', 'delivery_status')
    search_fields = ('id', 'recipient_name', 'recipient_email')
    fieldsets = (
        (None, {
            'fields': ('recipient_name', 'recipient_phone', 'recipient_email','postcards',)
        }),
        ('Платеж', {
            'fields': ( 'payment_status', 'payment')
        }),
        ('Доставка', {
            'fields': ('delivery_status', "delivery")
        }),
        ('СДЭК', {
            'fields': ('sdek_id', 'sdek_number')
        }),
    )
    autocomplete_fields  = ('postcards',)


    def postcards_total(self, obj):
        return obj.postcards_total


    postcards_total.short_description = 'Общая стоимость'  # Название колонки в админке


admin.site.register(Order, OrderAdmin)