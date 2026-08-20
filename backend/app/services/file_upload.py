import os
import uuid
import shutil
from fastapi import UploadFile
from backend.app.core.config import settings
from backend.app.utils.exceptions import FileTooLargeException, UnsupportedFileTypeException

class FileUploadService:
    def __init__(self):
        # Create storage folder if missing
        if not os.path.exists(settings.UPLOAD_DIR):
            os.makedirs(settings.UPLOAD_DIR)

    def validate_image(self, file: UploadFile) -> None:
        """Checks size boundaries and MIME type compatibility of file upload."""
        # 1. Check Content-Type
        if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise UnsupportedFileTypeException(
                f"Content-type '{file.content_type}' is invalid. Allowed: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
            )

        # 2. Check File Size Limit (Requires seeking to end and back)
        file.file.seek(0, os.SEEK_END)
        size_bytes = file.file.tell()
        file.file.seek(0)  # Rewind to start for subsequent reads

        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if size_bytes > max_bytes:
            raise FileTooLargeException(
                f"File size of {size_bytes / (1024 * 1024):.2f}MB exceeds limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

    async def save_image(self, file: UploadFile) -> str:
        """Validates and persists file asset to filesystem, returns public URL reference."""
        self.validate_image(file)

        # Generate unique, collision-proof filename
        extension = os.path.splitext(file.filename)[1] or ".jpg"
        unique_name = f"cmp_{uuid.uuid4().hex}{extension}"
        destination_path = os.path.join(settings.UPLOAD_DIR, unique_name)

        # Write stream to disk
        with open(destination_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return simulated relative asset URL for client retrieval
        return f"/uploads/{unique_name}"

file_upload_service = FileUploadService()
