from app.models.knowledge_bases import KnowledgeBase
from app.schemas.auth import JWTPayload
from app.schemas.kb import CreateKB
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def create_kb_service(db: AsyncSession, data: CreateKB, user: JWTPayload):
    new_kb = KnowledgeBase(name=data.name, user_id=user.id)
    db.add(new_kb)
    await db.commit()
    await db.refresh(new_kb)
    return new_kb


async def get_kbs_service(db: AsyncSession, user: JWTPayload):
    result = await db.execute(
        select(KnowledgeBase).where(KnowledgeBase.user_id == user.id)
    )
    return result.scalars().all()
