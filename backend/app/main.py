import logging
import time
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.api.v1.api import api_router
from backend.app.utils.exceptions import CampusCareException
from backend.app.middleware.auth import AuthMiddleware
from backend.app.middleware.rate_limit import RateLimitMiddleware

# Configure logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("campuscare-backend")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend microservices providing JWT credentials, ML classification, and transactional student grievances logging.",
    version="1.0.0",
    docs_url=f"{settings.API_V1_STR}/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS] or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuthMiddleware)
app.add_middleware(RateLimitMiddleware, limit_rpm=120)

# Custom performance profiling & logging middleware
@app.middleware("http")
async def log_request_time_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(
        f"Method: {request.method} Path: {request.url.path} Status: {response.status_code} Duration: {duration:.4f}s"
    )
    # Expose custom performance indicator header
    response.headers["X-Process-Time"] = f"{duration:.4f}s"
    return response

# Standardized Custom Exception Handlers
@app.exception_handler(CampusCareException)
async def campuscare_exception_handler(request: Request, exc: CampusCareException):
    logger.error(f"CampusCareError {exc.error_code} on {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code,
            "message": exc.detail
        }
    )

@app.exception_handler(Exception)
async def general_fallback_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled 500 error on {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected server-side exception occurred while processing this request."
        }
    )

# Register central routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount local uploaded file directory if it exists for content serving
try:
    import os
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
    logger.info(f"Mounted uploads static files from local dir: '{settings.UPLOAD_DIR}'")
except Exception as e:
    logger.warning(f"Failed to mount uploads folder statically: {str(e)}")

@app.get("/health", tags=["Utilities"])
def check_health():
    """Simple ping-pong health endpoint for container readiness validation."""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "project": settings.PROJECT_NAME
    }
