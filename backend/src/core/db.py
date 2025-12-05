from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker

from src.core.config import settings
from src.models.base import Base

engine: Engine = create_engine(
    settings.database_url,
    echo=False,
    future=True,
    pool_pre_ping=True,
    connect_args={
        "sslmode": "require",
    }
)
SessionLocal: sessionmaker = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator:
    db: SessionLocal = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    print('🔧 Creating all tables in the database...')
    Base.metadata.create_all(bind=engine)
    print('✅ Done!')
