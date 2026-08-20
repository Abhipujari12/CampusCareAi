from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FeedbackBase(BaseModel):
    rating: int = Field(..., ge=1, le=5, example=5, description="Satisfaction score on a scale from 1 to 5")
    comment: Optional[str] = Field(None, example="The service response time was exceptionally fast!")

class FeedbackCreate(FeedbackBase):
    complaint_id: int

class FeedbackOut(FeedbackBase):
    feedback_id: int
    complaint_id: int
    student_id: int
    submitted_at: datetime

    class Config:
        from_attributes = True
