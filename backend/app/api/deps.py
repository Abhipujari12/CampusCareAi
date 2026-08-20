from typing import Generator, List
from fastapi import Depends, security
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.models.role import Role
from backend.app.core.config import settings
from backend.app.core.security import decode_token
from backend.app.schemas.token import TokenData
from backend.app.utils.exceptions import InvalidCredentialsException, TokenExpiredException, InsufficientPermissionsException

# OAuth2 Scheme setup
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    """Decodes token and retrieves active DB user details; enforces standard validation rules."""
    try:
        payload = decode_token(token)
        user_id_str: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id_str is None or token_type != "access":
            raise InvalidCredentialsException()
            
        token_data = TokenData(user_id=user_id_str, token_type=token_type)
    except JWTError:
        raise TokenExpiredException()

    user = db.query(User).filter(User.user_id == int(token_data.user_id)).first()
    if not user:
        raise InvalidCredentialsException("Account matches authentication payload, but user record was not found.")
    if not user.is_active:
        raise InvalidCredentialsException("Account has been suspended or deactivated.")
        
    return user

class RoleChecker:
    """Enforces role boundaries (Student, Faculty, Staff, Admin, Super Admin) on routes."""
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> User:
        # Resolve role name from role_id on current user
        role = db.query(Role).filter(Role.role_id == current_user.role_id).first()
        if not role or role.role_name not in self.allowed_roles:
            allowed_str = ", ".join(self.allowed_roles)
            raise InsufficientPermissionsException(
                f"Requires permissions: [{allowed_str}]. Active role: '{role.role_name if role else 'None'}'."
            )
        return current_user
