from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    department: str
    school: str
    semester: int

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    department: str
    school: str
    semester: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ListingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    condition: int
    category: str
    listing_type: str
    department_tag: Optional[str] = None
    semester_tag: Optional[int] = None
    image_url: Optional[str] = None

class ListingResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    price: float
    condition: int
    category: str
    listing_type: str
    department_tag: Optional[str]
    semester_tag: Optional[int]
    image_url: Optional[str]
    is_active: bool
    is_flagged: bool
    seller_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str
    listing_id: int
    receiver_id: int

class MessageResponse(BaseModel):
    id: int
    content: str
    sender_id: int
    listing_id: int
    receiver_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[int] = None