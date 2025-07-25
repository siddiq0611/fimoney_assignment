from pydantic import BaseModel
from typing import Optional

class UserIn(BaseModel):
    username: str
    password: str

class ProductIn(BaseModel):
    name: str
    type: str
    sku: str
    image_url: str
    description: str
    quantity: int
    price: float

class ProductOut(BaseModel):
    id: str
    name: str
    type: str
    sku: str
    image_url: str
    description: str
    quantity: int
    price: float

class QuantityUpdate(BaseModel):
    quantity: int

class Token(BaseModel):
    access_token: str
    token_type: str