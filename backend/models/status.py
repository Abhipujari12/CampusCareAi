from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base

class ComplaintStatus(Base):
    __tablename__ = "complaint_status"

    status_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    status_name = Column(String(50), nullable=False, unique=True)  # e.g., "New", "Under Review", "Assigned", "Closed"

    # Relationships
    complaints = relationship("Complaint", back_populates="status")
    histories = relationship("ComplaintHistory", back_populates="status")
