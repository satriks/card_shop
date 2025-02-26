from django.contrib import admin
from .models import Postcard, Gallery, Category,Materials

# Register your models here.

class PostcardImageInline(admin.TabularInline):
    model = Gallery
    extra = 5  # Количество пустых форм для добавления новых изображений



class PostcardAdmin(admin.ModelAdmin):
    inlines = [PostcardImageInline, ]
    fields = ["title", "price","categories","materials", "available", "length", "width", "weight"]

admin.site.register(Postcard, PostcardAdmin)

admin.site.register(Category)
admin.site.register(Materials)