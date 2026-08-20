from typing import Optional, List
from sqlalchemy.orm import Session
from backend.models.complaint import Complaint

class ComplaintRepository:
    @staticmethod
    def get_by_id(db: Session, complaint_id: int) -> Optional[Complaint]:
        return db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first()

    @staticmethod
    def get_by_number(db: Session, complaint_number: str) -> Optional[Complaint]:
        return db.query(Complaint).filter(Complaint.complaint_number == complaint_number).first()

    @staticmethod
    def get_by_student(db: Session, student_id: int, skip: int = 0, limit: int = 100) -> List[Complaint]:
        return db.query(Complaint).filter(Complaint.student_id == student_id).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_staff(db: Session, staff_id: int, skip: int = 0, limit: int = 100) -> List[Complaint]:
        return db.query(Complaint).filter(Complaint.assigned_staff_id == staff_id).offset(skip).limit(limit).all()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Complaint]:
        return db.query(Complaint).offset(skip).limit(limit).all()

    @staticmethod
    def create(db: Session, complaint: Complaint) -> Complaint:
        db.add(complaint)
        db.commit()
        db.refresh(complaint)
        return complaint

    @staticmethod
    def update(db: Session, complaint: Complaint) -> Complaint:
        db.commit()
        db.refresh(complaint)
        return complaint
