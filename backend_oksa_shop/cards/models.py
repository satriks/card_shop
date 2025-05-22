import os
from django.utils.html import mark_safe
from django.db import models
from django.templatetags.static import static


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = 'Категории'
        verbose_name_plural = 'Категория'

    def __str__(self):
        return self.name

class Materials(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'
    def __str__(self):
        return self.name

class Postcard(models.Model):

    title = models.CharField(max_length=200, verbose_name="Название открытки") # Название открытки
    description = models.TextField(blank=True, verbose_name="Описание открытки")  # Описание открытки
    price = models.PositiveIntegerField(blank=True, null=True, verbose_name="Цена открытки")  # Цена открытки
    # image = models.ImageField(upload_to='postcards/', default=static("cards/default.png"))  # Изображение открытки     Добавить дефалтное изображение открытки
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создана :")  # Дата создания
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлена :")  # Дата последнего обновления
    available = models.BooleanField(default=True, verbose_name="В наличии")  # Доступность открытки
    categories = models.ManyToManyField(Category, related_name='postcards', verbose_name="Категории")  # Связь с категориями
    length = models.PositiveIntegerField(blank=True, null=True, verbose_name="Длинна")
    width = models.PositiveIntegerField(blank=True, null=True, verbose_name="Ширина")
    weight = models.PositiveIntegerField(blank=True, null=True, verbose_name="Вес")
    materials = models.ManyToManyField(Materials, related_name='postcards', verbose_name="Материалы")

    class Meta:
        verbose_name = 'Открытка'
        verbose_name_plural = 'Открытки'
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
        postcard_id = self.product.id
        # Создаем путь с использованием ID открытки
        return os.path.join('cards', str(postcard_id), filename)

    def save(self, *args, **kwargs):
        if self.product.id:
            self.image.field.upload_to = self.get_image_upload_path
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Image for {self.product.title}"