from abc import ABC, abstractmethod

from app.domain.entities.user import User


class AbstractUserRepository(ABC):
    @abstractmethod
    async def get_by_email(self, email: str) -> User | None:  # pragma: no cover
        raise NotImplementedError

    @abstractmethod
    async def add(self, user: User) -> User:  # pragma: no cover
        raise NotImplementedError
