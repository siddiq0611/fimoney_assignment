from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
import bcrypt
from decouple import config
from bson import ObjectId
from typing import List

from models import UserIn, ProductIn, ProductOut, QuantityUpdate, Token
from database import users_collection, products_collection

SECRET_KEY = config("SECRET_KEY", default="your-super-secret-key")
ALGORITHM = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)

app = FastAPI(title="Inventory Management API", version="1.0.0")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"},)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = users_collection.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserIn):
    if users_collection.find_one({"username": user_in.username}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")
    hashed_password = bcrypt.hashpw(user_in.password.encode('utf-8'), bcrypt.gensalt())
    user_data = {
        "username": user_in.username,
        "password": hashed_password.decode('utf-8')
    }
    users_collection.insert_one(user_data)
    return {"message": "User registered successfully"}

@app.post("/login", response_model=Token)
def login(user_in: UserIn):
    user = users_collection.find_one({"username": user_in.username})
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    if not bcrypt.checkpw(user_in.password.encode('utf-8'), user["password"].encode('utf-8')):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/products", status_code=status.HTTP_201_CREATED)
def add_product(product: ProductIn, current_user: dict = Depends(get_current_user)):
    product_data = product.dict()
    result = products_collection.insert_one(product_data)
    return {"product_id": str(result.inserted_id)}

@app.put("/products/{product_id}/quantity")
def update_product_quantity(product_id: str, quantity_update: QuantityUpdate, current_user: dict = Depends(get_current_user)):
    try:
        object_id = ObjectId(product_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product ID")
    result = products_collection.update_one(
        {"_id": object_id},
        {"$set": {"quantity": quantity_update.quantity}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    updated_product = products_collection.find_one({"_id": object_id})
    return {
        "id": str(updated_product["_id"]),
        "quantity": updated_product["quantity"]
    }

@app.get("/products")
def get_products(skip: int = 0, limit: int = 10, current_user: dict = Depends(get_current_user)):
    products = list(products_collection.find().skip(skip).limit(limit))
    result = []
    for product in products:
        product["id"] = str(product["_id"])
        del product["_id"]
        result.append(product)
    return result