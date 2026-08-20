import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

logger = logging.getLogger("campuscare-backend")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """Measures transaction duration and logs operational route statistics."""
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time
        
        logger.info(
            f"Method: {request.method} Path: {request.url.path} "
            f"Status: {response.status_code} Duration: {duration:.4f}s"
        )
        response.headers["X-Process-Time"] = f"{duration:.4f}s"
        return response
