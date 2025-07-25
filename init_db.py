from pymongo import MongoClient
from decouple import config
import sys

def init_database():
    try:
        MONGODB_URL = config("MONGODB_URL", default="mongodb://localhost:27017")
        DATABASE_NAME = config("DATABASE_NAME", default="inventory_db")
        client = MongoClient(MONGODB_URL)
        database = client[DATABASE_NAME]
        client.admin.command('ismaster')
        users_collection = database["users"]
        products_collection = database["products"]
        users_collection.create_index("username", unique=True)
        products_collection.create_index("sku")
        
        print(f" Database '{DATABASE_NAME}' initialized!")
        print(f" MongoDB URL: {MONGODB_URL}")
        print(" Collections created: users, products")
        print(" Indexes created: username (unique), sku")
        
    except Exception as e:
        print(f" Error initializing database: {e}")
        print("Make sure MongoDB is running and accessible.")
        sys.exit(1)

if __name__ == "__main__":
    init_database()