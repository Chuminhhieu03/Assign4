from django.db import models
from pymongo import MongoClient
from datetime import datetime
from .db import db

MONGO_URI = "mongodb+srv://ecomerce:vEaADljynubhXAvS@cluster0.lucouft.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["eccomerce"]


class Item:
    def __init__(self, name, price, image, item_type, description, **kwargs):
        self.name = name
        self.price = price
        self.image = image
        self.description = description
        self.type = item_type

    def save(self):
        data = self.__dict__
        db.item.insert_one(data)


class Book(Item):
    def __init__(self, author, isbn=None, **kwargs):
        super().__init__(**kwargs)
        self.author = author
        self.isbn = isbn

    def save(self):
        """ Lưu vào cả collection `item` và `book` """
        data = self.__dict__
        # Lưu vào collection item
        item_id = db.item.insert_one(data).inserted_id
        # Thêm ID của item vào book
        data["_id"] = item_id
        # Lưu vào collection book
        db.book.insert_one(data)


class Mobile(Item):
    def __init__(self, brand, model, **kwargs):
        super().__init__(**kwargs)
        self.brand = brand
        self.model = model

    def save(self):
        data = self.__dict__
        item_id = db.item.insert_one(data).inserted_id
        data["_id"] = item_id
        db.mobile.insert_one(data)


class Clothes(Item):
    def __init__(self,size, color, **kwargs):
        super().__init__(**kwargs)
        self.size = size
        self.color = color

    def save(self):
        data = self.__dict__
        item_id = db.item.insert_one(data).inserted_id
        data["_id"] = item_id
        db.clothes.insert_one(data)
