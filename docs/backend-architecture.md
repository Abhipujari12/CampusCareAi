# ⚙️ CampusCare AI - Backend Architecture Specification

This document details the high-performance asynchronous REST API backend architecture of **CampusCare AI**, outlining how our modern Python/FastAPI stack is designed to handle secure authentication, role-based database queries, relational mapping, and migrations for **1,000+ active campus users**.

---

## 1. Backend Core Technology Selection

The backend service is engineered with Python's most powerful enterprise frameworks to guarantee optimal speed, reliable data serializations, and robust typing:

| Library | Role in Architecture | Key Production Benefit |
| :--- | :--- | :--- |
| **FastAPI** | Core Web Framework | Async native, automatic OpenAPI documentation (Swagger), high-performance request handling. |
| **Uvicorn** | ASGI Web Server | Lightning-fast, production-ready server engine supporting HTTP/1.1 and WebSockets. |
| **SQLAlchemy (v2.0)** | Object Relational Mapper (ORM) | Fully typed query API, robust relationship loaders, connection pooling optimization. |
| **Alembic** | Database Migrations | Safe, reversible schema evolution tracking matched to SQL changes in code. |
| **Pydantic (v2.0)** | Data Validation & Schemas | Blazing-fast serialization utilizing Rust core compiler validations. |
| **PyJWT** | Authentication Tokens | Secure stateless token generation (`HS256` signature verification). |
| **Passlib + bcrypt** | Password Hashing | Industrial-grade cryptographic password protection using modern salting and hashing protocols. |

---

## 2. API Architecture Layering

The API directory layout enforces strict **Separation of Concerns (SoC)**, organizing logic into independent architectural layers:

```
                  ┌─────────────────────────────────────┐
                  │          Client Device Request      │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │      FastAPI Router / Controller    │  <-- Route endpoints
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    Middleware / Security Handler    │  <-- JWT validation & RBAC
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       Business Service Layer        │  <-- Domain validations
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │     Data Repository Accessor        │  <-- SQLAlchemy ORM Queries
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │     PostgreSQL Database Engine      │  <-- ACID Transactions
                  └─────────────────────────────────────┘
```

---

## 3. Role-Based Access Control (RBAC) & Security Policy

Access authorization is validated in-flight via custom FastAPI dependencies. The system decodes client-provided Bearer tokens, matches role claims, and intercepts requests before any database query:

### Security & RBAC Implementation (`/backend/app/core/security.py`)
```python
from datetime import datetime, timedelta
from typing import List
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_agent = HTTPBearer()

SECRET_KEY = "SUPER_SECRET_COMPLEX_KEY_SIGNATURE_HERE"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def generate_jwt_token(data: dict, expires_delta: timedelta = timedelta(hours=2)) -> str:
    payload = data.copy()
    payload.update({"exp": datetime.utcnow() + expires_delta})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, credentials: HTTPAuthorizationCredentials = Security(security_agent)):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_role = payload.get("role")
            if user_role not in self.allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access Denied: You do not have permission to view this resource."
                )
            return payload
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Authentication failed: Session expired or invalid."
            )
```

### Route Guard Usage Example
```python
from fastapi import APIRouter, Depends
from backend.app.core.security import RoleChecker

router = APIRouter(prefix="/api/admin", tags=["Administrator Actions"])

# Strictly enforce that only 'admin' or 'superadmin' roles can access this endpoint
@router.get("/metrics")
async def get_system_metrics(current_user: dict = Depends(RoleChecker(["admin", "superadmin"]))):
    return {
        "active_maintenance_staff": 12,
        "unassigned_complaints_count": 4,
        "average_resolution_sla_hours": 3.6
    }
```

---

## 4. Asynchronous Database Session Management

To support up to 1,000+ parallel users without blocking connection channels, FastAPI manages PostgreSQL queries asynchronously:

### Database Core Connection Setup (`/backend/database.py`)
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:secure@localhost:5432/campuscare")

# Initialize high-concurrency async engine with connection pooling parameters
async_engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,          # Keeps 20 active connections open in the pool
    max_overflow=10,       # Allows temporary overflow of 10 extra connections
    pool_recycle=1800,     # Recycle connections every 30 minutes to prevent stales
    echo=False
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

# Dependency to inject DB session into FastAPI request context
async def get_db_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

---

## 5. Migration Strategy with Alembic

Alembic acts as our database version control system, managing transitions seamlessly:

1. **Auto-Generation of migrations**:
   Whenever changes are made to our SQLAlchemy declarations, Alembic compares models directly with the active production schema:
   ```bash
   alembic revision --autogenerate -m "add_feedback_rating_to_complaints"
   ```
2. **Migration Run**:
   To upgrade database schemas on server deployment (such as Vercel + Cloud Run triggers):
   ```bash
   alembic upgrade head
   ```
This ensures complete protection against loss of active student tickets during updates.
