from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Postcard
from .serializers import PostcardSerializer


class PostcardViewSet(viewsets.ModelViewSet):
    queryset = Postcard.objects.all()
    serializer_class = PostcardSerializer