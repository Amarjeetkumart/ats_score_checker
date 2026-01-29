from collections.abc import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.analytics import AnalyticsService
from app.application.services.auth import AuthService
from app.application.services.resume_scoring import ResumeScoringService
from app.infrastructure.db.session import get_db_session
from app.infrastructure.repositories.resume_repository import ResumeRepository
from app.infrastructure.repositories.user_repository import UserRepository


async def get_resume_repository(db: AsyncSession = Depends(get_db_session)) -> ResumeRepository:
    return ResumeRepository(db)


def get_resume_scoring_service(
    repository: ResumeRepository = Depends(get_resume_repository),
) -> ResumeScoringService:
    return ResumeScoringService(repository=repository)


async def get_user_repository(db: AsyncSession = Depends(get_db_session)) -> UserRepository:
    return UserRepository(db)


def get_auth_service(repository: UserRepository = Depends(get_user_repository)) -> AuthService:
    return AuthService(repository=repository)


def get_analytics_service(session: AsyncSession = Depends(get_db_session)) -> AnalyticsService:
    return AnalyticsService(session)
