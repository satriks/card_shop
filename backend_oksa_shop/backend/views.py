from django.shortcuts import render, redirect

from backend import settings


def custom_404_view(request, exception):
    return redirect(f"{settings.TEST_SITE}/?status=404")