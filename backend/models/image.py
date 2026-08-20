import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class ComplaintImage(Base):
    __tablename__ = "complaint_images"

    image_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    complaint = relationship("Complaint", back_populates="images")
    uploader = relationship("User")
