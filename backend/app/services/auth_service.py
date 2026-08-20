from datetime import timedelta
from typing import Optional
from sqlalchemy.orm import Session
from backend.models.user import User
from backend.models.role import Role
from backend.app.repositories.user_repository import UserRepository
from backend.app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from backend.app.schemas.user import UserCreate
from backend.app.schemas.auth import LoginRequest, TokenResponse
from backend.app.utils.exceptions import InvalidCredentialsException, CampusCareException

class AuthService:
    @staticmethod
    def register_new_user(db: Session, user_create: UserCreate) -> User:
        # Check duplicate
        existing = UserRepository.get_by_email(db, user_create.college_email)
        if existing:
            raise CampusCareException(
                status_code=400,
                detail="College email already registered on this system.",
                error_code="EMAIL_ALREADY_EXISTS"
            )

        # Check role
        role = db.query(Role).filter(Role.role_id == user_create.role_id).first()
        if not role:
            raise CampusCareException(
                status_code=400,
                detail="Specified role code is invalid or unseeded.",
                error_code="INVALID_ROLE_ID"
            )

        # Create
        hashed_pw = get_password_hash(user_create.password)
        db_user = User(
            full_name=user_create.full_name,
            college_email=user_create.college_email,
            phone=user_create.phone,
            department=user_create.department,
            password_hash=hashed_pw,
            role_id=user_create.role_id,
            is_active=True
        )
        return UserRepository.create(db, db_user)

    @staticmethod
    def authenticate_user(db: Session, credentials: LoginRequest) -> TokenResponse:
        user = UserRepository.get_by_email(db, credentials.email)
        if not user or not verify_password(credentials.password, user.password_hash):
            raise InvalidCredentialsException()

        if not user.is_active:
            raise InvalidCredentialsException("Account matches authentication payload, but is currently deactivated.")

        # Resolve role name
        role = db.query(Role).filter(Role.role_id == user.role_id).first()
        role_name = role.role_name if role else "Student"

        # Generate tokens
        access = create_access_token(subject=user.user_id)
        refresh = create_refresh_token(subject=user.user_id)

        from backend.app.schemas.user import UserOut
        user_out = UserOut.from_orm(user)

        return TokenResponse(
            access_token=access,
            refresh_token=refresh,
            role=role_name,
            name=user.full_name,
            user=user_out
        )

auth_service = AuthService()
