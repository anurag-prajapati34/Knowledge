from app.core.security import create_access_token, hash_password, match_password
from app.models.users import User
from app.schemas.auth import UserLogin, UserRegister
from fastapi import HTTPException, status
from fastapi.security import HTTPBasic
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


""" Register new user  """


async def register_service(db: AsyncSession, data: UserRegister):
    # Check if user already exists with email
    existing_user = await get_user_by_email(db=db, email=data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
        )

    # Create new user
    new_user = User(
        full_name=data.full_name,
        email=data.email,
        password=hash_password(data.password),
    )
    # Stage new user
    db.add(new_user)

    # Actual commit to DB
    await db.commit()

    # Refresh user object to match database row
    await db.refresh(new_user)

    # Return new user matching database
    return new_user


""" Login user """

security = HTTPBasic()


async def login_service(db: AsyncSession, data: UserLogin):
    # Check if user already exists with email
    existing_user = await get_user_by_email(db=db, email=data.email)
    if existing_user == None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    # Mathc password
    given_pass = data.password
    hashed_pass = existing_user.password

    matched = match_password(given_pass, hashed_pass)
    if matched == False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    # Creat JWT Token

    token = create_access_token({"id": existing_user.id, "email": existing_user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "full_name": existing_user.full_name,
    }
