from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend.app.schemas.complaint import ComplaintCreate, ComplaintOut, ComplaintUpdate, AiPredictionOut
from backend.app.services.complaint_service import complaint_service
from backend.app.services.ai_service import ai_service
from backend.app.services.notification_service import notification_service
from backend.app.services.upload_service import upload_service
from backend.app.api.deps import get_current_user, RoleChecker
from backend.models.user import User
from backend.models.complaint import Complaint
from backend.models.image import ComplaintImage
from backend.models.ai_prediction import AIPrediction
from backend.app.repositories.complaint_repository import ComplaintRepository
from backend.app.utils.exceptions import CampusCareException

router = APIRouter()

@router.post("/", response_model=ComplaintOut, status_code=status.HTTP_201_CREATED)
def file_complaint(
    complaint_in: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Student", "Faculty"]))
):
    """Submits a new maintenance grievance ticket. Automatically evaluates urgency and category via AI."""
    complaint = complaint_service.create_complaint(db, current_user.user_id, complaint_in)

    # Trigger AI Assistant analysis in a safe background-ready manner
    try:
        prediction = ai_service.analyze_complaint(complaint.title, complaint.description)
        # Store prediction metrics
        db_prediction = AIPrediction(
            complaint_id=complaint.complaint_id,
            predicted_category=prediction["predicted_category"],
            predicted_priority=prediction["predicted_priority"],
            summary=prediction["summary"],
            confidence_score=prediction["confidence_score"]
        )
        db.add(db_prediction)
        db.commit()
    except Exception as e:
        import logging
        logging.getLogger("campuscare-backend").warning(f"Could not log AI analysis: {str(e)}")

    # Disptach ticket logged notifications
    notification_service.create_and_notify(
        db,
        current_user.user_id,
        "Grievance Ticket Registered",
        f"Your grievance ticket has been successfully registered with tracking identifier {complaint.complaint_number}."
    )

    return complaint

@router.get("/", response_model=List[ComplaintOut])
def get_my_or_all_complaints(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lists complaints based on user roles and administrative permissions."""
    # Enforce Role-Based Access Control boundaries
    from backend.models.role import Role
    role = db.query(Role).filter(Role.role_id == current_user.role_id).first()
    role_name = role.role_name if role else "Student"

    if role_name in ["Admin", "Super Admin"]:
        # Admin can view all complaints
        return ComplaintRepository.get_all(db, skip, limit)
    elif role_name == "Staff":
        # Staff can view assigned complaints
        return ComplaintRepository.get_by_staff(db, current_user.user_id, skip, limit)
    else:
        # Students and Faculty can only see their own tickets
        return ComplaintRepository.get_by_student(db, current_user.user_id, skip, limit)

@router.get("/{complaint_id}", response_model=ComplaintOut)
def get_complaint_details(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves comprehensive details of a specific ticket including history logs."""
    complaint = ComplaintRepository.get_by_id(db, complaint_id)
    if not complaint:
        raise CampusCareException(status_code=404, detail="Complaint ticket not found.", error_code="COMPLAINT_NOT_FOUND")

    # Access security check
    from backend.models.role import Role
    role = db.query(Role).filter(Role.role_id == current_user.role_id).first()
    role_name = role.role_name if role else "Student"

    if role_name not in ["Admin", "Super Admin"]:
        if role_name == "Staff" and complaint.assigned_staff_id != current_user.user_id:
            raise CampusCareException(status_code=403, detail="Unauthorized access to this ticket.", error_code="UNAUTHORIZED_ACCESS")
        elif role_name in ["Student", "Faculty"] and complaint.student_id != current_user.user_id:
            raise CampusCareException(status_code=403, detail="Unauthorized access to this ticket.", error_code="UNAUTHORIZED_ACCESS")

    return complaint

@router.post("/{complaint_id}/images", response_model=ComplaintOut)
async def attach_complaint_image(
    complaint_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Uploads and associates a troubleshooting reference photo with a ticket."""
    complaint = ComplaintRepository.get_by_id(db, complaint_id)
    if not complaint:
        raise CampusCareException(status_code=404, detail="Complaint ticket not found.", error_code="COMPLAINT_NOT_FOUND")

    # Save photo using CDN or local fallback
    image_url = await upload_service.upload_complaint_image(file)

    # Store reference
    db_image = ComplaintImage(
        complaint_id=complaint_id,
        image_url=image_url,
        uploaded_by=current_user.user_id
    )
    db.add(db_image)
    db.commit()
    db.refresh(complaint)

    return complaint

@router.get("/{complaint_id}/prediction", response_model=AiPredictionOut)
def get_complaint_ai_prediction(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin", "Staff"]))
):
    """Retrieves AI-driven predictions and priority models corresponding to the ticket."""
    prediction = db.query(AIPrediction).filter(AIPrediction.complaint_id == complaint_id).first()
    if not prediction:
        raise CampusCareException(status_code=404, detail="AI prediction data not available for this ticket.", error_code="PREDICTION_NOT_FOUND")
    return prediction
