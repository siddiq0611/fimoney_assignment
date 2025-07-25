from pymongo import MongoClient
from decouple import config

MONGODB_URL = config("MONGODB_URL", default="mongodb://localhost:27017")
DATABASE_NAME = config("DATABASE_NAME", default="inventory_db")

client = MongoClient(MONGODB_URL)
database = client[DATABASE_NAME]

users_collection = database["users"]
products_collection = database["products"]

users_collection.create_index("username", unique=True)
products_collection.create_index("sku")