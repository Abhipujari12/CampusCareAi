from datetime import timedelta
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from jose import JWTError

from backend.database import get_db
from backend.models.user import User
from backend.models.role import Role
from backend.app.core.config import settings
from backend.app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token
)
from backend.app.schemas.user import UserCreate, UserLogin, UserOut
from backend.app.schemas.token import Token, RefreshTokenRequest
from backend.app.api.deps import get_current_user
from backend.app.utils.exceptions import InvalidCredentialsException, TokenExpiredException, CampusCareException

router = APIRouter()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Registers a new system user profile, auto-hashing their access credentials."""
    # Check if duplicate email already present
    existing_user = db.query(User).filter(User.college_email == user_in.college_email).first()
    if existing_user:
        raise CampusCareException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="College email has already been registered on this portal.",
            error_code="EMAIL_ALREADY_EXISTS"
        )
    
    # Ensure role exists
    role = db.query(Role).filter(Role.role_id == user_in.role_id).first()
    if not role:
        raise CampusCareException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Specified role_id '{user_in.role_id}' is invalid or unseeded.",
            error_code="INVALID_ROLE_ID"
        )

    # Hash and create
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        full_name=user_in.full_name,
        college_email=user_in.college_email,
        phone=user_in.phone,
        department=user_in.department,
        password_hash=hashed_password,
        role_id=user_in.role_id,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login_user(login_in: UserLogin, db: Session = Depends(get_db)):
    """Verifies user email and password; responds with Access + Refresh JWT keys."""
    user = db.query(User).filter(User.college_email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.password_hash):
        raise InvalidCredentialsException()
        
    if not user.is_active:
        raise InvalidCredentialsException("This system profile has been suspended.")

    # Issue Tokens
    access_token = create_access_token(subject=user.user_id)
    refresh_token = create_refresh_token(subject=user.user_id)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user
    )

@router.post("/refresh", response_model=Token)
def refresh_access_token(refresh_req: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Validates long-lived refresh tokens and rotates them, producing a new access token block."""
    try:
        payload = decode_token(refresh_req.refresh_token)
        user_id_str: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id_str is None or token_type != "refresh":
            raise InvalidCredentialsException("Incompatible token profile supplied.")
    except JWTError:
        raise TokenExpiredException("Refresh token was expired or is structurally malformed.")

    user = db.query(User).filter(User.user_id == int(user_id_str)).first()
    if not user or not user.is_active:
        raise InvalidCredentialsException("User credentials revoked during token evaluation.")

    # Reissue rotated pairs
    new_access = create_access_token(subject=user.user_id)
    new_refresh = create_refresh_token(subject=user.user_id)

    return Token(
        access_token=new_access,
        refresh_token=new_refresh,
        user=user
    )

@router.get("/me", response_model=UserOut)
def fetch_current_profile(current_user: User = Depends(get_current_user)):
    """Returns profile info corresponding to active authenticated header session."""
    return current_user
