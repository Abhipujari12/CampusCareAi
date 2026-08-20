import datetime
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class StaffAssignment(Base):
    __tablename__ = "staff_assignments"

    assignment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_id = Column(Integer, ForeignKey("complaints.complaint_id"), nullable=False)
    staff_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    assigned_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    complaint = relationship("Complaint", back_populates="assignments")
    staff = relationship("User", foreign_keys=[staff_id])
    assigner = relationship("User", foreign_keys=[assigned_by])
