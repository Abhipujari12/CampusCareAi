from sqlalchemy.orm import Session
from backend.models.notification import Notification
from backend.models.user import User
from backend.app.repositories.notification_repository import NotificationRepository
from backend.app.services.email_service import email_service

class NotificationService:
    @staticmethod
    def create_and_notify(db: Session, user_id: int, title: str, message: str) -> Notification:
        # Create persistent database record
        db_notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            is_read=False
        )
        notification = NotificationRepository.create(db, db_notif)

        # Retrieve user email to deliver a copy
        user = db.query(User).filter(User.user_id == user_id).first()
        if user and user.college_email:
            email_body = f"""
            Dear {user.full_name},

            There is an update on your CampusCare AI Portal account:

            {message}

            Best regards,
            CampusCare AI Portal Team
            """
            email_service.send_notification_email(
                recipient_email=user.college_email,
                subject=f"[CampusCare] {title}",
                message_body=email_body
            )

        return notification

notification_service = NotificationService()
