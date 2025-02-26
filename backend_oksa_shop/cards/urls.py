from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostcardViewSet




router = DefaultRouter()
router.register(r'postcards', PostcardViewSet)
urlpatterns = [
    path('', include(router.urls)),
]