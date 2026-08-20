from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# Shared properties
class UserBase(BaseModel):
    full_name: str = Field(..., max_length=100, example="Abhishek Pujari")
    college_email: EmailStr = Field(..., example="pujariabhi2005@gmail.com")
    phone: Optional[str] = Field(None, max_length=20, example="+1234567890")
    department: Optional[str] = Field(None, max_length=100, example="Computer Science")
    is_active: Optional[bool] = True

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, example="strongpassword123")
    role_id: int = Field(..., description="1=Student, 2=Faculty, 3=Staff, 4=Admin, 5=Super Admin")

# Properties to receive via API on update
class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    department: Optional[str] = Field(None, max_length=100)
    password: Optional[str] = Field(None, min_length=6)
    profile_photo: Optional[str] = None
    is_active: Optional[bool] = None

# Properties to return to client (Database format)
class UserOut(UserBase):
    user_id: int
    role_id: int
    profile_photo: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Login helper schemas
class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="pujariabhi2005@gmail.com")
    password: str = Field(..., example="strongpassword123")
