from __future__ import annotations

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_settings = get_settings()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=_settings.access_token_expire_minutes)
    )
    payload = {"exp": expire, "sub": subject}
    return jwt.encode(payload, _settings.secret_key, algorithm=_settings.algorithm)


def decode_token(token: str) -> dict[str, str]:
    try:
        return jwt.decode(token, _settings.secret_key, algorithms=[_settings.algorithm])
    except JWTError as exc:  # pragma: no cover - defensive guard
        raise ValueError("Invalid token") from exc
