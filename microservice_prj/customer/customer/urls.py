from django.urls import path
from django.urls import path, include

urlpatterns = [
    path('customer/', include('customer_app.urls')),  # Trỏ đến app customer
]
