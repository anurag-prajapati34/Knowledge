from app.db.session import get_db
from app.dependencies.auth import authenticate
from app.schemas.auth import JWTPayload, UserLogin, UserRegister
from app.services.auth_service import get_me_service, login_service, register_service
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await register_service(db=db, data=data)
    return {"message": "success", "data": result}


security = HTTPBasic()


@router.post("/login")
async def login(
    credentials: HTTPBasicCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    data = UserLogin(email=credentials.username, password=credentials.password)

    print(data)
    result = await login_service(db=db, data=data)
    return {"message": "success", "data": result}


@router.get("/me")
async def me(
    user: JWTPayload = Depends(authenticate), db: AsyncSession = Depends(get_db)
):
    me = await get_me_service(db=db, user=user)
    return {"message": "success", "data": me}
