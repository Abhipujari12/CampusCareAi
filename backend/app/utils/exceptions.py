from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class CampusCareException(HTTPException):
    """Base API Exception for consistent CampusCare REST responses."""
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str,
        headers: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code

class UserNotFoundException(CampusCareException):
    def __init__(self, detail: str = "Requested user was not found on our system."):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="USER_NOT_FOUND"
        )

class InvalidCredentialsException(CampusCareException):
    def __init__(self, detail: str = "Invalid email, password, or authentication credentials."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="INVALID_CREDENTIALS",
            headers={"WWW-Authenticate": "Bearer"}
        )

class TokenExpiredException(CampusCareException):
    def __init__(self, detail: str = "Signature has expired or token is invalid."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="TOKEN_EXPIRED",
            headers={"WWW-Authenticate": "Bearer"}
        )

class InsufficientPermissionsException(CampusCareException):
    def __init__(self, detail: str = "You do not have administrative permissions to execute this request."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="INSUFFICIENT_PERMISSIONS"
        )

class FileTooLargeException(CampusCareException):
    def __init__(self, detail: str = "Attached file exceeds allowed system thresholds."):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code="FILE_TOO_LARGE"
        )

class UnsupportedFileTypeException(CampusCareException):
    def __init__(self, detail: str = "Uploaded file type format is not supported."):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code="UNSUPPORTED_FILE_TYPE"
        )
