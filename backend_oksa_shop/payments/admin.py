from django.contrib import admin
from .models import Payment
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('payment_id',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


admin.site.register(Payment, PaymentAdmin)