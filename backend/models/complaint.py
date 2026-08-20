import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    complaint_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    complaint_number = Column(String(50), nullable=False, unique=True, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    building_id = Column(Integer, ForeignKey("buildings.building_id"), nullable=False, index=True)
    room_id = Column(Integer, ForeignKey("rooms.room_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("complaint_categories.category_id"), nullable=False, index=True)
    priority_id = Column(Integer, ForeignKey("priorities.priority_id"), nullable=False, index=True)
    status_id = Column(Integer, ForeignKey("complaint_status.status_id"), nullable=False, index=True)
    assigned_staff_id = Column(Integer, ForeignKey("users.user_id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    student = relationship("User", foreign_keys=[student_id], back_populates="complaints_reported")
    assigned_staff = relationship("User", foreign_keys=[assigned_staff_id], back_populates="complaints_assigned")
    building = relationship("Building", back_populates="complaints")
    room = relationship("Room", back_populates="complaints")
    category = relationship("ComplaintCategory", back_populates="complaints")
    priority = relationship("Priority", back_populates="complaints")
    status = relationship("ComplaintStatus", back_populates="complaints")

    # Linked tables
    images = relationship("ComplaintImage", back_populates="complaint", cascade="all, delete-orphan")
    history_records = relationship("ComplaintHistory", back_populates="complaint", cascade="all, delete-orphan")
    assignments = relationship("StaffAssignment", back_populates="complaint", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="complaint", cascade="all, delete-orphan")
    ai_predictions = relationship("AiPrediction", back_populates="complaint", cascade="all, delete-orphan")
