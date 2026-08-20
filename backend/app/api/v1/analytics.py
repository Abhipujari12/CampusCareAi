from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from backend.database import get_db
from backend.app.services.analytics_service import analytics_service
from backend.app.api.deps import RoleChecker
from backend.models.user import User

router = APIRouter()

@router.get("/summary", response_model=Dict[str, Any])
def get_analytical_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Admin", "Super Admin"]))
):
    """Retrieves operational metrics, including ticket distributions and average ratings."""
    return analytics_service.get_dashboard_summary(db)
