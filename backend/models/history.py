import datetime
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"

    history_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    status_id = Column(Integer, ForeignKey("complaint_status.status_id"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    remarks = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    complaint = relationship("Complaint", back_populates="history_records")
    status = relationship("ComplaintStatus", back_populates="histories")
    updater = relationship("User")
