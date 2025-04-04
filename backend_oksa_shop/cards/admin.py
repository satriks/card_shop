from django.contrib import admin
from .models import Postcard, Gallery, Category,Materials
from django import forms
from django.db import models

# Register your models here.
class PostcardImageInline(admin.TabularInline):
    model = Gallery
    # form = GalleryForm
    extra = 6  # Количество пустых форм для добавления новых изображений



class PostcardAdmin(admin.ModelAdmin):
    inlines = [PostcardImageInline, ]
    fields = ["title", "price","categories","materials", "available", "length", "width", "weight", ]

    # Сортировка материалов в алфавитном порядке
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['materials'].queryset = Materials.objects.all().order_by('name')
        form.base_fields['categories'].queryset = Category.objects.all().order_by('name')
        return form

    # Увеличение размера окна выбора
    formfield_overrides = {
        models.ManyToManyField: {
            'widget': forms.SelectMultiple(attrs={'size': '10', 'style': 'width: 500px;'})  # Увеличиваем размер окна
        },
    }
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)  # Сохраняем объект Postcard
        if hasattr(form, 'save_images'):
            form.save_images(obj) 


admin.site.register(Postcard, PostcardAdmin)
admin.site.register(Category)
admin.site.register(Materials)
