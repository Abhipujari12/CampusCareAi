from pydantic import BaseModel, Field
from datetime import datetime

class NotificationBase(BaseModel):
    title: str = Field(..., max_length=150, example="Grievance Dispatched")
    message: str = Field(..., example="A technician has been assigned to address your technical ticket.")

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationOut(NotificationBase):
    notification_id: int
    user_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
