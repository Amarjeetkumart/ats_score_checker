from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.interfaces.user_repository import AbstractUserRepository
from app.domain.entities.user import User
from app.infrastructure.db import models


class UserRepository(AbstractUserRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_email(self, email: str) -> User | None:
        result = await self._session.execute(
            select(models.UserModel).where(models.UserModel.email == email)
        )
        instance = result.scalar_one_or_none()
        if instance is None:
            return None
        return self._to_entity(instance)

    async def add(self, user: User) -> User:
        model = models.UserModel(
            email=user.email,
            hashed_password=user.hashed_password,
            full_name=user.full_name,
            is_active=user.is_active,
        )
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return self._to_entity(model)

    def _to_entity(self, instance: models.UserModel) -> User:
        return User(
            id=instance.id,
            email=instance.email,
            hashed_password=instance.hashed_password,
            full_name=instance.full_name,
            is_active=instance.is_active,
            created_at=instance.created_at,
        )
