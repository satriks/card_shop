from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, CustomTokenRefreshView, UserProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),

]