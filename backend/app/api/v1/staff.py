from fastapi import APIRouter, Depends, status, Body
from sqlalchemy.orm import Session
from typing import Optional
from backend.database import get_db
from backend.app.schemas.complaint import ComplaintOut
from backend.app.services.complaint_service import complaint_service
from backend.app.services.notification_service import notification_service
from backend.app.api.deps import RoleChecker
from backend.models.user import User
from backend.models.complaint import Complaint
from backend.app.utils.exceptions import CampusCareException

router = APIRouter()

@router.put("/complaints/{complaint_id}/update-status", response_model=ComplaintOut)
def update_complaint_status_by_staff(
    complaint_id: int,
    status_id: int = Body(..., embed=True),
    remarks: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Staff", "Admin", "Super Admin"]))
):
    """Enables assigned field technicians to update maintenance progress states."""
    complaint = db.query(Complaint).filter(Complaint.complaint_id == complaint_id).first()
    if not complaint:
        raise CampusCareException(status_code=404, detail="Complaint ticket not found.", error_code="COMPLAINT_NOT_FOUND")

    # Enforce technical ownership limits unless administrator
    if current_user.role_id != 4 and current_user.role_id != 5: # Not Admin/Super Admin
        if complaint.assigned_staff_id != current_user.user_id:
            raise CampusCareException(status_code=403, detail="You can only process tickets officially assigned to your profile.", error_code="UNAUTHORIZED_ACCESS")

    # Perform transition
    updated_complaint = complaint_service.update_status(
        db, 
        user_id=current_user.user_id, 
        complaint_id=complaint_id, 
        status_id=status_id, 
        remarks=remarks
    )

    # Resolve human readable status name
    from backend.models.status import Status
    status_obj = db.query(Status).filter(Status.status_id == status_id).first()
    status_label = status_obj.status_name if status_obj else f"Code {status_id}"

    # Notify student
    notification_service.create_and_notify(
        db,
        complaint.student_id,
        f"Grievance Progress: {status_label}",
        f"Grievance {complaint.complaint_number} has progressed to state '{status_label}'. Remark: {remarks or 'None'}"
    )

    return updated_complaint
