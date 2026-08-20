from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.app.schemas.feedback import FeedbackCreate, FeedbackOut
from backend.app.api.deps import RoleChecker
from backend.models.user import User
from backend.models.feedback import Feedback
from backend.models.complaint import Complaint
from backend.app.utils.exceptions import CampusCareException

router = APIRouter()

@router.post("/", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
def submit_service_feedback(
    feedback_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Student", "Faculty"]))
):
    """Allows students to rate resolved issues and provide text recommendations."""
    # Ensure complaint exists and belongs to the active submitter
    complaint = db.query(Complaint).filter(Complaint.complaint_id == feedback_in.complaint_id).first()
    if not complaint:
        raise CampusCareException(status_code=404, detail="Complaint ticket not found.", error_code="COMPLAINT_NOT_FOUND")

    if complaint.student_id != current_user.user_id:
        raise CampusCareException(status_code=403, detail="You can only submit review comments on tickets you filed.", error_code="UNAUTHORIZED_ACCESS")

    # Ensure complaint status is resolved or closed (status_id in [5, 6])
    if complaint.status_id not in [5, 6]:
        raise CampusCareException(status_code=400, detail="Feedback can only be registered once the grievance is officially resolved.", error_code="INVALID_TICKET_STATE")

    # Ensure duplicate feedback is not logged
    existing = db.query(Feedback).filter(Feedback.complaint_id == feedback_in.complaint_id).first()
    if existing:
        raise CampusCareException(status_code=400, detail="You have already registered service ratings on this ticket.", error_code="FEEDBACK_ALREADY_EXISTS")

    db_feedback = Feedback(
        complaint_id=feedback_in.complaint_id,
        student_id=current_user.user_id,
        rating=feedback_in.rating,
        comment=feedback_in.comment
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)

    return db_feedback
