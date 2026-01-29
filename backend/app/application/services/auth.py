from __future__ import annotations

from datetime import timedelta

from app.application.interfaces.user_repository import AbstractUserRepository
from app.core.config import get_settings
from app.domain.entities.user import User
from app.infrastructure.security.auth import (
    create_access_token,
    get_password_hash,
    verify_password,
)

_settings = get_settings()


class AuthService:
    def __init__(self, repository: AbstractUserRepository) -> None:
        self._repository = repository

    async def register_user(self, *, email: str, password: str, full_name: str | None) -> User:
        existing = await self._repository.get_by_email(email)
        if existing is not None:
            raise ValueError("Email already registered")
        user = User(email=email, hashed_password=get_password_hash(password), full_name=full_name)
        return await self._repository.add(user)

    async def authenticate(self, *, email: str, password: str) -> tuple[str, User]:
        user = await self._repository.get_by_email(email)
        if user is None or not verify_password(password, user.hashed_password):
            raise ValueError("Invalid credentials")
        access_expires = timedelta(minutes=_settings.access_token_expire_minutes)
        token = create_access_token(subject=str(user.id), expires_delta=access_expires)
        return token, user

    async def issue_refresh_token(self, *, user_id: str) -> str:
        refresh_expires = timedelta(minutes=_settings.refresh_token_expire_minutes)
        return create_access_token(subject=user_id, expires_delta=refresh_expires)

    async def issue_access_token(self, *, user_id: str) -> str:
        access_expires = timedelta(minutes=_settings.access_token_expire_minutes)
        return create_access_token(subject=user_id, expires_delta=access_expires)
