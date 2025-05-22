from django.contrib import admin

from .models import CustomUser


class MyModelAdmin(admin.ModelAdmin):

    search_fields = ('email',)  # Поля, по которым будет осуществляться поиск
    ordering = ('email',)
    class Media:
        css = {
            'all': ('css/custom.css',)
        }


admin.site.register(CustomUser, MyModelAdmin)
# Register your models here

