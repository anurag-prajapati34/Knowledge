from app.config import settings
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

engine = create_async_engine(
    settings.database_url,
    echo=True,
)
AsyncSessionLocal = async_sessionmaker(autoflush=False, autocommit=False, bind=engine)


async def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
