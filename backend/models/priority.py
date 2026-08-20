from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base

class Priority(Base):
    __tablename__ = "priorities"

    priority_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    priority_name = Column(String(50), nullable=False, unique=True)
    response_time = Column(String(50), nullable=False)  # e.g., "2 Hours", "8 Hours"

    # Relationships
    complaints = relationship("Complaint", back_populates="priority")
