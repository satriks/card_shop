from django.contrib import admin

from .models import CustomUser, Address, Order


class MyModelAdmin(admin.ModelAdmin):
    class Media:
        css = {
            'all': ('css/custom.css',)
        }


admin.site.register(CustomUser, MyModelAdmin)
# Register your models here

admin.site.register(Address)

admin.site.register(Order)