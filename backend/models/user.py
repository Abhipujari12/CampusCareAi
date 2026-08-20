import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_id = Column(Integer, ForeignKey("roles.role_id"), nullable=False)
    full_name = Column(String(100), nullable=False)
    college_email = Column(String(150), nullable=False, unique=True, index=True)
    phone = Column(String(20), nullable=True)
    department = Column(String(100), nullable=True)
    password_hash = Column(String(255), nullable=False)
    profile_photo = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    role = relationship("Role", back_populates="users")
    complaints_reported = relationship("Complaint", foreign_keys="[Complaint.student_id]", back_populates="student")
    complaints_assigned = relationship("Complaint", foreign_keys="[Complaint.assigned_staff_id]", back_populates="assigned_staff")
    notifications = relationship("Notification", back_populates="user")
    feedbacks = relationship("Feedback", back_populates="student")
    audit_logs = relationship("AuditLog", back_populates="user")
