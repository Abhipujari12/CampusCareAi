import pytest
from typing import Generator
import os

# Set environment test variables before any imports
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test_super_secret_signing_key_32_characters"
os.environ["JWT_ALGORITHM"] = "HS256"

@pytest.fixture(scope="session")
def anyio_backend() -> str:
    return "asyncio"

@pytest.fixture
def mock_jwt_token() -> str:
    # A dummy mock token payload for unit testing routes
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50QGNvbGxlZ2UuZWR1Iiwicm9sZSI6InN0dWRlbnQifQ.sig"
