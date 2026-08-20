from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.app.schemas.user import UserOut, UserUpdate
from backend.app.api.deps import get_current_user, RoleChecker
from backend.models.user import User
from backend.app.repositories.user_repository import UserRepository
from backend.app.utils.exceptions import CampusCareException

router = APIRouter()

@router.get("/", response_model=List[UserOut])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"]))
):
    """Admin-only endpoint to list all registered users on the system."""
    return UserRepository.get_all(db, skip, limit)

@router.put("/me", response_model=UserOut)
def update_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Enables authenticated users to update their profile information."""
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.phone is not None:
        current_user.phone = user_update.phone
    if user_update.department is not None:
        current_user.department = user_update.department
    if user_update.profile_photo is not None:
        current_user.profile_photo = user_update.profile_photo

    if user_update.password is not None:
        from backend.app.core.security import get_password_hash
        current_user.password_hash = get_password_hash(user_update.password)

    updated_user = UserRepository.update(db, current_user)
    return updated_user

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"]))
):
    """Fetches full profile information corresponding to a specific user record."""
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise CampusCareException(status_code=404, detail="Requested user was not found.", error_code="USER_NOT_FOUND")
    return user
