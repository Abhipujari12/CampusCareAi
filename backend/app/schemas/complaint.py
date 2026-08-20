from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ComplaintBase(BaseModel):
    title: str = Field(..., max_length=150, example="Leaking overhead water tank")
    description: str = Field(..., example="The main tank in Academic Block B floor 2 toilet is dripping heavily.")
    building_id: int = Field(..., example=2)
    room_id: int = Field(..., example=10)
    category_id: int = Field(..., example=2)

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=150)
    description: Optional[str] = None
    building_id: Optional[int] = None
    room_id: Optional[int] = None
    category_id: Optional[int] = None
    priority_id: Optional[int] = None
    status_id: Optional[int] = None
    assigned_staff_id: Optional[int] = None

class ComplaintImageOut(BaseModel):
    image_id: int
    image_url: str
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ComplaintHistoryOut(BaseModel):
    history_id: int
    status_id: int
    updated_by: int
    remarks: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True

class ComplaintOut(ComplaintBase):
    complaint_id: int
    complaint_number: str
    student_id: int
    priority_id: int
    status_id: int
    assigned_staff_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    # Optional nested details
    images: List[ComplaintImageOut] = []
    history_records: List[ComplaintHistoryOut] = []

    class Config:
        from_attributes = True

class AiPredictionOut(BaseModel):
    prediction_id: int
    complaint_id: int
    predicted_category: str
    predicted_priority: str
    summary: Optional[str] = None
    confidence_score: float
    created_at: datetime

    class Config:
        from_attributes = True
