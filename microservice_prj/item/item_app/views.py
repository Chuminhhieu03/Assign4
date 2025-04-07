from django.http import JsonResponse
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from .db import db
from .models import Book, Mobile, Clothes
import json
from django.views.decorators.csrf import csrf_exempt


def get_all_items(request):
    try:
        page_number = int(request.GET.get('pageNumber', 1))
        keyword = request.GET.get('keyword', '')
        item_type = request.GET.get('item_type', '')
        min_price = request.GET.get('min_price', 0)
        max_price = request.GET.get('max_price', 1000000000)
        query = {}
        if keyword:
            query['name'] = {"$regex": keyword, "$options": "i"}
        if item_type:
            item_type_list = item_type.split(',')  # Chuyển thành danh sách
            query['type'] = {"$in": item_type_list}  # Lọc theo danh sách
        if min_price:
            query['price'] = {"$gte": int(min_price)}
        if max_price:
            query['price'] = {"$lte": int(max_price)}

        items_per_page = 10
        skip = (page_number - 1) * items_per_page

        items = list(db.item.find(query).skip(skip).limit(items_per_page))

        # Chuyển đổi ObjectId sang chuỗi
        for item in items:
            item["_id"] = str(item["_id"])

        return JsonResponse({"items": items}, safe=False)

    except ValueError:
        return JsonResponse({"error": "Invalid page number"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_item_by_id(requset):
    if requset.method == "GET":
        try:
            item_id = requset.GET.get("id")
            object_id = ObjectId(item_id)
            item = db.item.find_one({"_id": object_id})
            if item:
                item["_id"] = str(item["_id"])
                return JsonResponse(item)
            return JsonResponse({"error": "Item not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def create_book(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            author = data.get("author")
            isbn = data.get("isbn")
            name = data.get("name")
            price = data.get("price")
            image = data.get("image")
            description = data.get("description")
            item_type = "book"

            # Tạo bản ghi Book
            book = Book(author=author, isbn=isbn, name=name,
                        price=price, image=image, description=description, item_type=item_type)
            book.save()  # Gọi save() để lưu vào cả `item` và `book`

            return JsonResponse({
                "message": "Book created",
                "book_id": str(book._id)  # Chuyển ObjectId thành string
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def create_mobile(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            name = data.get("name")
            brand = data.get("brand")
            model = data.get("model")
            price = data.get("price")
            image = data.get("image")
            description = data.get("description")
            item_type = "mobile"

            # Tạo bản ghi Mobile
            mobile = Mobile(name=name, brand=brand, model=model,
                            price=price, image=image, description=description, item_type=item_type)
            mobile.save()

            return JsonResponse({
                "message": "Mobile created",
                "mobile_id": str(mobile._id)
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def create_clothes(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            name = data.get("name")
            size = data.get("size")
            color = data.get("color")
            price = data.get("price")
            image = data.get("image")
            description = data.get("description")
            item_type = "clothes"

            # Tạo bản ghi Clothes
            clothes = Clothes(name=name, size=size, color=color,
                              price=price, image=image, description=description, item_type=item_type)
            clothes.save()

            return JsonResponse({
                "message": "Clothes created",
                "clothes_id": str(clothes._id)
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
