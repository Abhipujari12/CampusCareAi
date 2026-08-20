from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database import Base

class Building(Base):
    __tablename__ = "buildings"

    building_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    building_name = Column(String(100), nullable=False, unique=True)
    code = Column(String(10), nullable=False, unique=True)

    # Relationships
    rooms = relationship("Room", back_populates="building")
    complaints = relationship("Complaint", back_populates="building")
