from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from app.config import settings

"""Hashing password"""


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


"""Match raw passw"""


def match_password(password: str, hashed_password: str) -> bool:
    matched = bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
    return matched == True


"""Create JWT Token"""


def create_access_token(payload: dict) -> str:

    print(payload)

    print("secred-->", settings)

    if settings.jwt_secret_key == None:
        raise Exception("Secret key not found")

    payload["type"] = "access"
    payload["exp"] = datetime.now(timezone.utc) + timedelta(hours=1)
    token = jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm="HS256",
    )
    return token
