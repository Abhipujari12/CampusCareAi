from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class ComplaintCategory(Base):
    __tablename__ = "complaint_categories"

    category_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_name = Column(String(100), nullable=False, unique=True)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)

    # Relationships
    department = relationship("Department", back_populates="categories")
    complaints = relationship("Complaint", back_populates="category")
