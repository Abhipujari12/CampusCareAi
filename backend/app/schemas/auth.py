from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from backend.app.schemas.user import UserOut

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., example="student@college.edu")
    password: str = Field(..., example="strongpassword123")

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    role: str
    name: str
    user: UserOut

class PasswordResetRequest(BaseModel):
    email: EmailStr = Field(..., example="student@college.edu")

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)
