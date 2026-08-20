import time
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, status
from fastapi.responses import JSONResponse

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit_rpm: int = 120):
        super().__init__(app)
        self.limit_rpm = limit_rpm
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        """Pre-evaluates rate limits per client IP address before forwarding requests."""
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Prune old logs (> 60s ago)
        self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < 60]
        
        if len(self.requests[client_ip]) >= self.limit_rpm:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "success": False,
                    "error_code": "RATE_LIMIT_EXCEEDED",
                    "message": f"Too many requests registered from client host '{client_ip}'. Please try again in a moment."
                }
            )

        self.requests[client_ip].append(now)
        response = await call_next(request)
        return response
