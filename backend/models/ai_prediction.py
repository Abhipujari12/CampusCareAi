import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class AiPrediction(Base):
    __tablename__ = "ai_predictions"

    prediction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    predicted_category = Column(String(100), nullable=False)
    predicted_priority = Column(String(50), nullable=False)
    summary = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=False, default=1.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    complaint = relationship("Complaint", back_populates="ai_predictions")
