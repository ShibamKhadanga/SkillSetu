from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

# SQLite async engine
# connect_args={"check_same_thread": False} is required for SQLite
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    """Yields a DB session for each request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def create_tables():
    """Auto-creates all tables if they don't exist."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ SQLite tables ready (skillsetu.db)")


async def connect_db():
    await create_tables()
    logger.info("✅ SQLite database connected — skillsetu.db created in backend/")


async def disconnect_db():
    await engine.dispose()
    logger.info("SQLite connection closed")
