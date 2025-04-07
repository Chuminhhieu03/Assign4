from django.urls import path
from .views import GetPaymentView, GetShipmentView, OrderViewSet

urlpatterns = [
    path('createOrder/', OrderViewSet.as_view(), name='create_order'),
    path('getOrder/', OrderViewSet.as_view(), name='get_orders_by_user'),
    path('getPayment/', GetPaymentView.as_view(), name='get_payments'),
    path('getShipment/', GetShipmentView.as_view(), name='get_shipments'),
]
