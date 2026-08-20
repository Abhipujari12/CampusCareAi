from fastapi import APIRouter
from backend.app.api.v1 import (
    auth,
    users,
    complaints,
    admin,
    staff,
    notifications,
    feedback,
    analytics
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["Complaints"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administration"])
api_router.include_router(staff.router, prefix="/staff", tags=["Staff Operations"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
