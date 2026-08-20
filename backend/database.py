import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Neon PostgreSQL connection string (sourced from environment variables)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/campuscare")

engine = create_engine(
    DATABASE_URL,
    # Enable connection pooling for production robustness
    pool_size=10,
    max_overflow=20,
    pool_recycle=300,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for models
Base = declarative_base()

def get_db():
    """Dependency for retrieving database session in routes"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
