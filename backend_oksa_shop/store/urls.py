from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, CustomTokenRefreshView, UserProfileView, ConfirmEmailView, \
    PasswordResetRequestView, PasswordResetEmailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('confirm-email/<uidb64>/<token>/', ConfirmEmailView.as_view(), name='confirm_email'),
    path('password_reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password_reset/confirm/<uidb64>/<token>/', PasswordResetEmailView.as_view(), name='password_reset_confirm'),

]