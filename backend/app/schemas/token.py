from typing import Optional
from pydantic import BaseModel, Field
from backend.app.schemas.user import UserOut

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[str] = None
    token_type: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="The refresh token string issued previously")
