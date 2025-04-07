from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from dotenv import load_dotenv
from revproxy.views import ProxyView
import os

load_dotenv()

ITEM_SERVICE_URL = os.getenv("ITEM_SERVICE_URL")
CUSTOMER_SERVICE_URL = os.getenv("CUSTOMER_SERVICE_URL")
CART_SERVICE_URL = os.getenv("CART_SERVICE_URL")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL")


class CustomerServiceProxyView(ProxyView):
    upstream = CUSTOMER_SERVICE_URL
    rewrite_response = True

    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
class ItemServiceProxyView(ProxyView):
    upstream = ITEM_SERVICE_URL
    rewrite_response = True

    def dispatch(self, request, path):
        return super().dispatch(request, path)
    
class CartServiceProxyView(ProxyView):
    upstream = CART_SERVICE_URL
    rewrite_response = True

    def dispatch(self, request, path):
        return super().dispatch(request, path)
    
class OrderServiceProxyView(ProxyView):
    upstream = ORDER_SERVICE_URL
    rewrite_response = True

    def dispatch(self, request, path):
        return super().dispatch(request, path)
