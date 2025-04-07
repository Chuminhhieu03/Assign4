from uuid import UUID
from django.http import JsonResponse
from .models import Customer
import json
from .serializes import CustomerSerializer
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.views import View
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.db import connection


def get_all_customers(request):
    customers = Customer.objects.all()
    serializer = CustomerSerializer(customers, many=True)
    return JsonResponse(serializer.data, safe=False)


def get_customer_by_id(request, id):
    customer = Customer.objects.get(id=id)
    serializer = CustomerSerializer(customer)
    return JsonResponse(serializer.data)


def create_customer(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))

            # Cập nhật thông tin sách
            customer = Customer.objects.create(
                name=data.get("name"),
                email=data.get("email"),
                phone=data.get("phone"),
                address=data.get("address"),
            )

            return JsonResponse({"message": "Customer created", "customer_id": customer.id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


def update_customer(request, id):
    if request.method == "PUT":  # Chỉ chấp nhận phương thức PUT
        try:
            customer = Customer.objects.get(id=id)  # Tìm sách theo ID
            data = json.loads(request.body.decode("utf-8"))  # Đọc JSON từ body

            # Cập nhật thông tin sách
            customer.name = data.get("name", customer.name)
            customer.email = data.get("email", customer.email)
            customer.phone = data.get("phone", customer.phone)
            customer.address = data.get("address", customer.address)
            customer.save()

            return JsonResponse({"message": "Customer updated", "customer_id": customer.id}, status=200)
        except Customer.DoesNotExist:
            return JsonResponse({"error": "Customer not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def delete_customer(request, id):
    customer = Customer.objects.get(id=id)
    customer.delete()
    return JsonResponse({'message': 'Deleted successfully!'})


def login(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        name = data.get("name")
        password = data.get("password")
        try:
            customer = Customer.objects.get(name=name, password=password)
            if customer:
                refresh = RefreshToken.for_user(customer)
                access_token = str(refresh.access_token)
                # user_id = access_token["user_id"]
                # print(user_id)
                print(access_token)
                return JsonResponse({
                    "message": "Login successfully!",
                    "token": access_token,
                    "name": name
                }, status=200)
            else:
                return JsonResponse({"message": "Login failed!"}, status=400)
        except Customer.DoesNotExist:
            return JsonResponse({"message": "Login failed!"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


class DecodeTokenView(View):
    """ Giải mã token và trả về customer_id """

    def get(self, request):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")

        if not token:
            return JsonResponse({"error": "No token provided"}, status=401)
        try:
            # Giải mã token bằng AccessToken của SimpleJWT
            access_token = AccessToken(token)
            user_id = access_token["user_id"]  # Đây là ID của Customer
            first_customer = Customer.objects.first()
            # Kiểm tra truy vấn SQL
            user_id = UUID(user_id)
            if first_customer:
                print(f"user_id: {user_id}, type: {type(user_id)}")
                print(
                    f"first01: {first_customer.id}, type: {type(first_customer.id)}")
            else:
                print("No customers found")
            customer = Customer.objects.get(id=user_id)
            print(f"SQL Query: {connection.queries[-1]}")
            return JsonResponse({"customer_id": customer.id}, status=200)

        except TokenError as e:
            return JsonResponse({"error": "Token error: " + str(e)}, status=500)
        except InvalidToken as e:
            return JsonResponse({"error": "Invalid token: " + str(e)}, status=500)
        except Customer.DoesNotExist as e:
            return JsonResponse({"error": "Customer not found " + str(e)}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
