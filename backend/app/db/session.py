from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker
from app.config import settings

engine = create_async_engine(settings.database_url,echo=True,)
AsyncSessionLocal = async_sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
    
)

async def get_db():
    db=AsyncSessionLocal()
    try:
        yield db
    finally:
       await db.close()