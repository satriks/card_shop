# tasks.py
from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.tokens import default_token_generator
from store.models import CustomUser as User
from django.conf import settings
from rq import queue
def send_registration_email(user_id):
    user = User.objects.get(pk=user_id)  # Получаем пользователя по ID
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    base_url = settings.BASE_HOST
    link = f"{base_url}/api/confirm-email/{uid}/{token}/"
    subject = "Подтверждение регистрации"
    html_message = render_to_string('emails/registration_confirmation.html', {'user': user, 'confirmation_link': link})
    plain_message = strip_tags(html_message)
    from_email = 'satriks@mail.ru'
    to = user.email
    email = EmailMultiAlternatives(subject, plain_message, from_email, [to])
    email.content_subtype = "html"  # Указываем, что это HTML-сообщение
    email.attach_alternative(html_message, "text/html")
    email.send()

def send_password_reset_email(user_id, reset_link):
    user = User.objects.get(pk=user_id)  # Получаем пользователя по ID
    subject = "Восстановление пароля"
    html_message = render_to_string('emails/password_reset.html', {'reset_link': reset_link})
    plain_message = strip_tags(html_message)
    from_email = 'satriks@mail.ru'
    to = user.email
    email = EmailMultiAlternatives(subject, from_email, [to])
    email.content_subtype = "html"  # Указываем, что это HTML-сообщение
    email.attach_alternative(html_message, "text/html")
    email.send()

def send_new_order_notification(order_id):
    from orders.models import Order  # Импортируйте вашу модель заказа
    order = Order.objects.get(pk=order_id)  # Получаем заказ по ID
    owner_email = settings.OWNER_EMAIL  # Убедитесь, что этот параметр настроен в ваших настройках
    subject = "Новый заказ создан и оплачен"
    html_message = render_to_string('emails/new_order_notification.html', {'order': order})
    plain_message = strip_tags(html_message)
    from_email = 'satriks@mail.ru'
    to = owner_email
    email = EmailMultiAlternatives(subject, plain_message, from_email, [to])
    email.content_subtype = "html"  # Указываем, что это HTML-сообщение
    email.attach_alternative(html_message, "text/html")
    email.send()