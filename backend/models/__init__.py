from backend.database import Base
from backend.models.role import Role
from backend.models.user import User
from backend.models.building import Building
from backend.models.room import Room
from backend.models.department import Department
from backend.models.category import ComplaintCategory
from backend.models.priority import Priority
from backend.models.status import ComplaintStatus
from backend.models.complaint import Complaint
from backend.models.image import ComplaintImage
from backend.models.history import ComplaintHistory
from backend.models.assignment import StaffAssignment
from backend.models.notification import Notification
from backend.models.feedback import Feedback
from backend.models.ai_prediction import AiPrediction
from backend.models.audit_log import AuditLog

# Gather all models for metadata compilation
metadata = Base.metadata

__all__ = [
    "Base",
    "metadata",
    "Role",
    "User",
    "Building",
    "Room",
    "Department",
    "ComplaintCategory",
    "Priority",
    "ComplaintStatus",
    "Complaint",
    "ComplaintImage",
    "ComplaintHistory",
    "StaffAssignment",
    "Notification",
    "Feedback",
    "AiPrediction",
    "AuditLog"
]
