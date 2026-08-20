from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Room(Base):
    __tablename__ = "rooms"

    room_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    building_id = Column(Integer, ForeignKey("buildings.building_id"), nullable=False)
    floor = Column(Integer, nullable=False)
    room_number = Column(String(20), nullable=False)

    # Relationships
    building = relationship("Building", back_populates="rooms")
    complaints = relationship("Complaint", back_populates="room")
