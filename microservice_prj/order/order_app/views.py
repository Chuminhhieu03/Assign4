from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from django.shortcuts import get_object_or_404
from .models import Payment, Shipment, Order
from .serializers import OrderSerializer, PaymentSerializer, ShipmentSerializer
from django.db import transaction
from .DTO import OrderDTO, CartDTO
import requests
import os


CUSTOMER_SERVICE_URL = os.environ.get("CUSTOMER_SERVICE_URL")
ITEM_SERVICE_URL = os.environ.get("ITEM_SERVICE_URL")
CART_SERVICE_URL = os.environ.get("CART_SERVICE_URL")


class OrderViewSet(APIView):

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

    def post(self, request):
        # Lấy token từ header
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        customer_id = self.get_customer_id_from_token(token)

        if not customer_id:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        shipment = get_object_or_404(Shipment, id=data.get("shipmentId"))
        payment = get_object_or_404(Payment, id=data.get("paymentId"))
        total = data.get("total")
        address = data.get("address")

        # Tạo đơn hàng mới
        new_order = Order.objects.create(
            customer_id=customer_id,
            shipment=shipment,
            payment=payment,
            total=total,
            address=address,
            status=False
        )

        # Gửi request đến cart service để thêm order_id vào cart của người dùng chưa được add
        response = requests.post(
            f"{CART_SERVICE_URL}/add_order_id_to_cart/", json={"customer_id": customer_id, "order_id": str(new_order.id)})

        if response.status_code != 200:
            return Response({"error": "Error when adding order_id to cart"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(OrderSerializer(new_order).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        customer_id = self.get_customer_id_from_token(token)

        if not customer_id:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        # 🔹 Lấy danh sách Order theo Customer ID
        orders = Order.objects.filter(customer_id=customer_id)
        order_dto_list = []

        for order in orders:
            order_id = order.id  # Lấy ID của order

            # 🔹 Gọi API Cart Service để lấy danh sách Cart theo Order ID
            cart_response = requests.get(
                f"{CART_SERVICE_URL}/get_carts_by_order_id/?order_id={order_id}")

            cart_dto_list = []
            if cart_response.status_code == 200:
                carts = cart_response.json()  # Danh sách Cart

                for cart in carts:
                    item_id = cart["item_id"]

                    # 🔹 Gọi API Item Service để lấy thông tin Item theo item_id
                    item_response = requests.get(
                        f"{ITEM_SERVICE_URL}/getItemById/?id={item_id}")

                    if item_response.status_code == 200:
                        item_data = item_response.json()  # Thông tin sản phẩm
                        cart_dto = CartDTO(
                            cart_id=cart["id"],
                            cart_item_image=item_data.get("image", ""),
                            cart_item_name=item_data.get("name", ""),
                            cart_item_price=item_data.get("price", 0),
                            cart_quantity=cart["quantity"]
                        )
                    else:
                        cart_dto = CartDTO(
                            cart_id=cart["id"],
                            cart_item_image="",
                            cart_item_name="Unknown",
                            cart_item_price=0,
                            cart_quantity=cart["quantity"]
                        )

                    cart_dto_list.append(cart_dto)

            order_dto = OrderDTO(
                order_id=order.id,
                order_date=order.date,
                order_status=order.status,
                order_total=order.total,
                order_address=order.address,
                order_shipment=order.shipment.name,
                order_payment=order.payment.name,
                order_cart=cart_dto_list
            )

            order_dto_list.append(order_dto)

        return Response([order.to_dict() for order in order_dto_list], status=status.HTTP_200_OK)


class GetPaymentView(APIView):
    """ API lấy danh sách phương thức thanh toán """

    def get(self, request):
        payments = Payment.objects.all()
        return Response(PaymentSerializer(payments, many=True).data, status=status.HTTP_200_OK)


class GetShipmentView(APIView):
    """ API lấy danh sách phương thức vận chuyển """

    def get(self, request):
        shipments = Shipment.objects.all()
        return Response(ShipmentSerializer(shipments, many=True).data, status=status.HTTP_200_OK)
