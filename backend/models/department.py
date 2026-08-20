from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base

class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    department_name = Column(String(100), nullable=False, unique=True)

    # Relationships
    categories = relationship("ComplaintCategory", back_populates="department")
