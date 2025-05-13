import django_rq
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('store.urls')),
    path('cards/', include('cards.urls')),
    path('sdek/', include('delivery.urls')),
    path('payments/', include('payments.urls')),
    path('orders/', include('orders.urls')),
    path('django-rq/', include('django_rq.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
