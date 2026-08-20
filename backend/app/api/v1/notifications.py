from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.app.schemas.notification import NotificationOut
from backend.app.repositories.notification_repository import NotificationRepository
from backend.app.api.deps import get_current_user
from backend.models.user import User

router = APIRouter()

@router.get("/", response_model=List[NotificationOut])
def get_my_notifications(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves unread and read alerts issued to the active session user."""
    return NotificationRepository.get_by_user(db, current_user.user_id, skip, limit)

@router.get("/unread-count", response_model=int)
def get_unread_alerts_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves the count of active, unread notification badges."""
    return NotificationRepository.get_unread_count(db, current_user.user_id)

@router.post("/mark-all-read", status_code=status.HTTP_200_OK)
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Acknowledges all outstanding alerts as seen."""
    NotificationRepository.mark_all_as_read(db, current_user.user_id)
    return {"success": True, "message": "All unread alerts marked as seen."}
