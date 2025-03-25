from django.contrib import admin
from .models import Postcard, Gallery, Category,Materials


# Register your models here.
class PostcardImageInline(admin.TabularInline):
    model = Gallery
    # form = GalleryForm
    extra = 5  # Количество пустых форм для добавления новых изображений



class PostcardAdmin(admin.ModelAdmin):
    inlines = [PostcardImageInline, ]
    fields = ["title", "price","categories","materials", "available", "length", "width", "weight", ]
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)  # Сохраняем объект Postcard
        if hasattr(form, 'save_images'):
            form.save_images(obj) 


admin.site.register(Postcard, PostcardAdmin)
admin.site.register(Category)
admin.site.register(Materials)
