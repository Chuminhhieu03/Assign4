from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Cart
from .serializers import CartSerializer
from .DTO import CartItemDTO
import requests
import os
from uuid import UUID

CUSTOMER_SERVICE_URL = os.environ.get("CUSTOMER_SERVICE_URL")
ITEM_SERVICE_URL = os.environ.get("ITEM_SERVICE_URL")


class CartViewSet(viewsets.ViewSet):
    """ ViewSet xử lý giỏ hàng """

    def get_customer_id_from_token(self, token):
        """ Gửi token qua Customer Service để lấy `customer_id` """
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            f"{CUSTOMER_SERVICE_URL}/decode_token/", headers=headers)

        if response.status_code == 200:
            return response.json().get("customer_id")
        return None

    def get_item_from_service(self, item_id):
        """ Kiểm tra xem item có tồn tại trong Item Service không """
        response = requests.get(
            f"{ITEM_SERVICE_URL}/getItemById/?id={item_id}")
        return response.status_code == 200

    @action(detail=False, methods=["post"])
    def add(self, request):
        """ API: Thêm sản phẩm vào giỏ hàng """
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        customer_id = self.get_customer_id_from_token(token)

        if not customer_id:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        item_id = data.get("itemId")
        quantity = data.get("quantity", 1)

        # Kiểm tra item có tồn tại không
        if not self.get_item_from_service(item_id):
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Tạo giỏ hàng mới
        cart = Cart.objects.create(
            customer_id=customer_id, item_id=item_id, quantity=quantity)
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path='list-carts')
    def list_carts(self, request):
        """ API: Lấy danh sách giỏ hàng của khách hàng """
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        customer_id = self.get_customer_id_from_token(token)

        if not customer_id:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        carts = Cart.objects.filter(customer_id=customer_id, order_id=None)
        cartsDTO = []
        for cart in carts:
            response = requests.get(
                f"{ITEM_SERVICE_URL}/getItemById/?id={cart.item_id}")
            cartItemDTO = CartItemDTO(
                cart.id, cart.item_id, response.json().get("name"), response.json().get("price"), response.json().get("image"), cart.quantity, cart.customer_id)
            cartsDTO.append(cartItemDTO.to_dict())

        return Response(cartsDTO, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def updateCart(self, request):
        """ API: Cập nhật số lượng sản phẩm trong giỏ hàng
        """
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        customer_id = self.get_customer_id_from_token(token)

        if not customer_id:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        cart_id = data.get("itemId")
        quantity = data.get("quantity")

        cart = get_object_or_404(Cart, pk=cart_id)
        cart.quantity = quantity
        cart.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["delete"])
    def deleteCart(self, request):

        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        customer_id = self.get_customer_id_from_token(token)

        if not customer_id:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        cart_id_str = request.GET.get("id")
        if not cart_id_str:
            return Response({"error": "No cart ID provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_id = UUID(cart_id_str)
        except ValueError:
            return Response({"error": "Invalid cart ID"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(id=cart_id, customer_id=customer_id)
            cart.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["post"])
    def add_order_id_to_cart(self, request):
        """ API: Thêm order_id vào giỏ hàng của khách hàng """
        customer_id = request.data.get("customer_id")
        order_id = request.data.get("order_id")

        carts = Cart.objects.filter(customer_id=customer_id, order_id=None)
        for cart in carts:
            cart.order_id = order_id
            cart.save()

        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def get_carts_by_order_id(self, request):
        """ API: Lấy danh sách giỏ hàng theo order_id """
        order_id = request.GET.get("order_id")
        order_id = UUID(order_id)
        carts = Cart.objects.filter(order_id=order_id)
        return Response(CartSerializer(carts, many=True).data, status=status.HTTP_200_OK)
