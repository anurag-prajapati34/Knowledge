from app.db.session import get_db
from app.dependencies.auth import authenticate
from app.schemas.auth import JWTPayload
from app.schemas.kb import CreateKB
from app.services.kb_service import create_kb_service, get_kbs_service
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/kb", tags=["Knowledge Base"])


# middlware for bearer token verification and user authorization

security = HTTPBearer()


@router.post("/")
async def create(
    data: CreateKB,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await create_kb_service(db=db, data=data, user=user)
    return {"message": "success", "data": result}


@router.get("/")
async def get_kbs(
    user: JWTPayload = Depends(authenticate), db: AsyncSession = Depends(get_db)
):
    result = await get_kbs_service(db=db, user=user)
    return {"message": "success", "data": result}
