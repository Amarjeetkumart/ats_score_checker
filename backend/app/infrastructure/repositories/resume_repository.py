from __future__ import annotations

from typing import Iterable

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.interfaces.resume_repository import AbstractResumeRepository
from app.domain.entities.resume import Resume
from app.infrastructure.db import models


class ResumeRepository(AbstractResumeRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, resume: Resume) -> Resume:
        db_obj = models.ResumeModel(
            owner_id=resume.owner_id,
            file_url=resume.file_url,
            parsed_text=resume.parsed_text,
            extracted_skills=resume.extracted_skills,
            extracted_keywords=resume.extracted_keywords,
        )
        self._session.add(db_obj)
        await self._session.flush()
        await self._session.refresh(db_obj)
        return self._to_entity(db_obj)

    async def get(self, resume_id: int) -> Resume | None:
        result = await self._session.execute(
            select(models.ResumeModel).where(models.ResumeModel.id == resume_id)
        )
        db_obj = result.scalar_one_or_none()
        if not db_obj:
            return None
        return self._to_entity(db_obj)

    async def list_for_owner(self, owner_id: int) -> Iterable[Resume]:
        result = await self._session.execute(
            select(models.ResumeModel).where(models.ResumeModel.owner_id == owner_id)
        )
        return [self._to_entity(item) for item in result.scalars().all()]

    async def delete(self, resume_id: int) -> None:
        result = await self._session.execute(
            select(models.ResumeModel).where(models.ResumeModel.id == resume_id)
        )
        db_obj = result.scalar_one_or_none()
        if db_obj is not None:
            await self._session.delete(db_obj)

    def _to_entity(self, db_obj: models.ResumeModel) -> Resume:
        return Resume(
            id=db_obj.id,
            owner_id=db_obj.owner_id,
            file_url=db_obj.file_url,
            parsed_text=db_obj.parsed_text,
            extracted_skills=list(db_obj.extracted_skills or []),
            extracted_keywords=list(db_obj.extracted_keywords or []),
            created_at=db_obj.created_at,
            updated_at=db_obj.updated_at,
        )
