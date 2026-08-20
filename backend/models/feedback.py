import datetime
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    feedback_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5 stars
    comment = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    complaint = relationship("Complaint", back_populates="feedbacks")
    student = relationship("User", back_populates="feedbacks")
