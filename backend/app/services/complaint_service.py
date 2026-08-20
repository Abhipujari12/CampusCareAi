import datetime
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.models.complaint import Complaint
from backend.models.history import ComplaintHistory
from backend.models.assignment import StaffAssignment
from backend.app.repositories.complaint_repository import ComplaintRepository
from backend.app.schemas.complaint import ComplaintCreate, ComplaintUpdate
from backend.app.utils.exceptions import CampusCareException

class ComplaintService:
    @staticmethod
    def generate_complaint_number(db: Session) -> str:
        """Generates sequential, unique complaint ticket keys (e.g., CMP-2026-0001)"""
        year = datetime.datetime.utcnow().year
        # Count existing tickets in this year to compute sequence
        count = db.query(Complaint).filter(Complaint.complaint_number.like(f"CMP-{year}-%")).count()
        sequence = f"{count + 1:04d}"
        return f"CMP-{year}-{sequence}"

    @classmethod
    def create_complaint(cls, db: Session, student_id: int, complaint_in: ComplaintCreate) -> Complaint:
        comp_number = cls.generate_complaint_number(db)
        
        # Build ticket
        db_complaint = Complaint(
            complaint_number=comp_number,
            student_id=student_id,
            title=complaint_in.title,
            description=complaint_in.description,
            building_id=complaint_in.building_id,
            room_id=complaint_in.room_id,
            category_id=complaint_in.category_id,
            priority_id=3, # Default: Medium
            status_id=1,   # Default: New
        )
        
        complaint = ComplaintRepository.create(db, db_complaint)
        
        # Create initial history log
        history = ComplaintHistory(
            complaint_id=complaint.complaint_id,
            status_id=1,
            updated_by=student_id,
            remarks="Grievance filed by student through student portal."
        )
        db.add(history)
        db.commit()
        db.refresh(complaint)
        
        return complaint

    @staticmethod
    def assign_staff(db: Session, admin_id: int, complaint_id: int, staff_id: int) -> Complaint:
        complaint = ComplaintRepository.get_by_id(db, complaint_id)
        if not complaint:
            raise CampusCareException(status_code=404, detail="Complaint not found.", error_code="COMPLAINT_NOT_FOUND")

        # Update assignment details
        complaint.assigned_staff_id = staff_id
        complaint.status_id = 3 # Assigned
        
        # Add to history
        history = ComplaintHistory(
            complaint_id=complaint_id,
            status_id=3,
            updated_by=admin_id,
            remarks=f"Dispatcher assigned ticket to technical personnel."
        )
        db.add(history)
        
        # Log formal assignment metrics
        assignment = StaffAssignment(
            complaint_id=complaint_id,
            staff_id=staff_id,
            assigned_by=admin_id
        )
        db.add(assignment)
        
        db.commit()
        db.refresh(complaint)
        return complaint

    @staticmethod
    def update_status(db: Session, user_id: int, complaint_id: int, status_id: int, remarks: Optional[str] = None) -> Complaint:
        complaint = ComplaintRepository.get_by_id(db, complaint_id)
        if not complaint:
            raise CampusCareException(status_code=404, detail="Complaint not found.", error_code="COMPLAINT_NOT_FOUND")

        complaint.status_id = status_id
        
        # Add to history
        history = ComplaintHistory(
            complaint_id=complaint_id,
            status_id=status_id,
            updated_by=user_id,
            remarks=remarks or f"Milestone updated by operator."
        )
        db.add(history)
        
        db.commit()
        db.refresh(complaint)
        return complaint

complaint_service = ComplaintService()
