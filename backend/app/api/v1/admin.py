from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.app.schemas.complaint import ComplaintOut
from backend.app.services.complaint_service import complaint_service
from backend.app.services.notification_service import notification_service
from backend.app.api.deps import RoleChecker
from backend.models.user import User
from backend.models.complaint import Complaint
from backend.app.utils.exceptions import CampusCareException

router = APIRouter()

@router.post("/complaints/{complaint_id}/assign/{staff_id}", response_model=ComplaintOut)
def assign_technician(
    complaint_id: int,
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"]))
):
    """Enables dispatchers or administrators to assign technical staff to a registered ticket."""
    complaint = complaint_service.assign_staff(db, current_user.user_id, complaint_id, staff_id)

    # Notify student
    notification_service.create_and_notify(
        db,
        complaint.student_id,
        "Technical Personnel Assigned",
        f"Grievance {complaint.complaint_number} has been assigned to technical personnel for service delivery."
    )

    # Notify staff
    notification_service.create_and_notify(
        db,
        staff_id,
        "New Work Assignment",
        f"You have been assigned to address maintenance ticket {complaint.complaint_number}: '{complaint.title}'."
    )

    return complaint

@router.put("/complaints/{complaint_id}/override-priority/{priority_id}", response_model=ComplaintOut)
def override_ticket_priority(
    complaint_id: int,
    priority_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"]))
):
    """Overrides automated AI priority calculation with direct human operator assessment."""
    complaint = db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first()
    if not complaint:
        raise CampusCareException(status_code=404, detail="Complaint ticket not found.", error_code="COMPLAINT_NOT_FOUND")

    complaint.priority_id = priority_id
    db.commit()
    db.refresh(complaint)

    # Notify student of priority adjustments if necessary
    notification_service.create_and_notify(
        db,
        complaint.student_id,
        "Urgency Level Adjusted",
        f"The dispatch operator has reviewed and adjusted the service response priority of {complaint.complaint_number}."
    )

    return complaint
