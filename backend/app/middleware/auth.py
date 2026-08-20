from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, status
from fastapi.responses import JSONResponse
from jose import JWTError
from backend.app.core.security import decode_token

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """Standard HTTP middleware to perform early JWT validation and security headers."""
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                # Validate JWT token format and signature early if supplied
                decode_token(token)
            except JWTError:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "success": False,
                        "error_code": "TOKEN_EXPIRED",
                        "message": "Signature has expired or credential payload is structurally malformed."
                    },
                    headers={"WWW-Authenticate": "Bearer"}
                )

        response = await call_next(request)
        return response
