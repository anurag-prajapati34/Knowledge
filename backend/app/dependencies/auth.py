from app.core.security import verify_jwt_token
from app.schemas.auth import JWTPayload
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import ExpiredSignatureError

security = HTTPBearer()


def authenticate(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> JWTPayload:
    token = credentials.credentials

    try:
        user = verify_jwt_token(token)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        )

    if user == None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    return JWTPayload(**user)
