import os
from django.utils.html import mark_safe
from django.db import models
from django.templatetags.static import static


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True) # Название категории
    # postcard = models.ForeignKey(Postcard, on_delete=models.CASCADE, related_name='categories')
    def __str__(self):
        return self.name

class Materials(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Postcard(models.Model):

    title = models.CharField(max_length=200)  # Название открытки
    description = models.TextField(blank=True)  # Описание открытки
    price = models.PositiveIntegerField(blank=True, null=True)  # Цена открытки
    # image = models.ImageField(upload_to='postcards/', default=static("cards/default.png"))  # Изображение открытки     Добавить дефалтное изображение открытки
    created_at = models.DateTimeField(auto_now_add=True)  # Дата создания
    updated_at = models.DateTimeField(auto_now=True)  # Дата последнего обновления
    available = models.BooleanField(default=True)  # Доступность открытки
    categories = models.ManyToManyField(Category, related_name='postcards')  # Связь с категориями
    length = models.PositiveIntegerField(blank=True, null=True)
    width = models.PositiveIntegerField(blank=True, null=True)
    weight = models.PositiveIntegerField(blank=True, null=True)
    materials = models.ManyToManyField(Materials, related_name='postcards')

    def __str__(self):
        return self.title


# def get_image_upload_path(instance, filename):
#     # Получаем ID открытки
#     postcard_id = instance.product.id
#     # Создаем путь с использованием ID открытки
#     return os.path.join('cards', str(postcard_id), filename)

# Добавить сохранение по папкам, нужно продумать логику что делать при создании открытки когда еще нет ID

class Gallery(models.Model):
    image = models.ImageField(upload_to='cards/')
    product = models.ForeignKey(Postcard, on_delete=models.CASCADE, related_name='images')

    def get_image_upload_path(self, instance, filename):
        print(filename)
        print(instance)
        print(self)
        postcard_id = self.product.id
        # Создаем путь с использованием ID открытки
        return os.path.join('cards', str(postcard_id), filename)

    def save(self, *args, **kwargs):
        if self.product.id:
            self.image.field.upload_to = self.get_image_upload_path
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Image for {self.product.title}"