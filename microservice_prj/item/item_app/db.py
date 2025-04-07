from pymongo import MongoClient
import os

MONGO_URI = "mongodb+srv://ecomerce:vEaADljynubhXAvS@cluster0.lucouft.mongodb.net/"
MONGO_DB_NAME = "eccomerce"

class MongoDBClient:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]

db = MongoDBClient().db
