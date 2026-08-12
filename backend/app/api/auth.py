from app.db.session import get_db
from app.schemas.auth import UserLogin, UserRegister
from app.services.auth_service import login_service, register_service
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await register_service(db=db, data=data)
    return {"message": "success", "data": result}


security = security = HTTPBasic()


@router.post("/login")
async def login(
    credentials: HTTPBasicCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    data = UserLogin(email=credentials.username, password=credentials.password)

    print(data)
    result = await login_service(db=db, data=data)
    return {"message": "success", "data": result}
