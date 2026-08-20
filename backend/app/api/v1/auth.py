from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.app.schemas.user import UserCreate, UserOut
from backend.app.schemas.auth import LoginRequest, TokenResponse, PasswordResetRequest
from backend.app.services.auth_service import auth_service
from backend.app.api.deps import get_current_user
from backend.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Registers a new student, faculty, staff, or admin profile."""
    return auth_service.register_new_user(db, user_in)

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates credentials and returns access + refresh token blocks."""
    return auth_service.authenticate_user(db, credentials)

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns profile details of active logged-in user session."""
    return current_user

@router.post("/reset-password")
def request_password_reset(request: PasswordResetRequest):
    """Simulates requesting a password reset email."""
    # We log or trigger emails safely
    from backend.app.services.email_service import email_service
    email_service.send_notification_email(
        recipient_email=request.email,
        subject="[CampusCare] Password Reset Link",
        message_body="Please click the following link to securely reset your credentials: https://campuscare.ai/reset-password?token=mock_token_123"
    )
    return {"success": True, "message": "Password reset instructions have been dispatched to your email address."}
