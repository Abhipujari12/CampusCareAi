from typing import List, Optional
from sqlalchemy.orm import Session
from backend.models.notification import Notification

class NotificationRepository:
    @staticmethod
    def get_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 50) -> List[Notification]:
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_unread_count(db: Session, user_id: int) -> int:
        return db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).count()

    @staticmethod
    def create(db: Session, notification: Notification) -> Notification:
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def mark_all_as_read(db: Session, user_id: int) -> None:
        db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).update({"is_read": True}, synchronize_session=False)
        db.commit()
