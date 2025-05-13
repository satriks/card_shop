from __future__ import absolute_import, unicode_literals
# Это необходимо, чтобы убедиться, что задача Celery будет запущена при старте проекта
from celery import app as celery_app
__all__ = ('celery_app',)