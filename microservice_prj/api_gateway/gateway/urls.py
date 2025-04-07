from django.urls import path
from .views import CustomerServiceProxyView, ItemServiceProxyView, CartServiceProxyView, OrderServiceProxyView

urlpatterns = [
    path('customer/<path:path>',
         CustomerServiceProxyView.as_view(), name='customer-proxy'),
    path('item/<path:path>',
         ItemServiceProxyView.as_view(), name='item-proxy'),
    path('cart/<path:path>',
         CartServiceProxyView.as_view(), name='cart-proxy'),
     path('order/<path:path>',
           OrderServiceProxyView.as_view(), name='order-proxy'),
]
