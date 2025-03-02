from rest_framework import serializers
from .models import Postcard, Category, Materials, Gallery

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['image']
class MaterialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materials
        fields = ['name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]

class PostcardSerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()
    materials = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    class Meta:
        model = Postcard
        fields = '__all__'

    def get_categories(self, obj):
        return [category.name for category in obj.categories.all()]

    def get_materials(self, obj):
        return [material.name for material in obj.materials.all()]

    def get_images(self, obj):
        return [image.image.url for image in obj.images.all()]