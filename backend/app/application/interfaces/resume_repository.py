from abc import ABC, abstractmethod
from typing import Iterable

from app.domain.entities.resume import Resume


class AbstractResumeRepository(ABC):
    @abstractmethod
    async def add(self, resume: Resume) -> Resume:  # pragma: no cover - interface method
        raise NotImplementedError

    @abstractmethod
    async def get(self, resume_id: int) -> Resume | None:  # pragma: no cover - interface method
        raise NotImplementedError

    @abstractmethod
    async def list_for_owner(self, owner_id: int) -> Iterable[Resume]:  # pragma: no cover
        raise NotImplementedError

    @abstractmethod
    async def delete(self, resume_id: int) -> None:  # pragma: no cover - interface method
        raise NotImplementedError
