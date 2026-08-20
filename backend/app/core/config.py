import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CampusCare AI Portal"
    
    # JWT Security Settings
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "70505f11df2481665a396e95c1c4f74d081b8979e9da2884b2e8a11bc32b137c")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 2  # 2 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7         # 7 days
    ALGORITHM: str = "HS256"

    # CORS Allowed Origins
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        return []

    # Database connection string
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://user:password@localhost:5432/campuscare"
    )

    # Storage Settings for File Uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_UPLOAD_SIZE_MB: int = 10  # 10 Megabytes limit
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    class Config:
        case_sensitive = True

settings = Settings()
