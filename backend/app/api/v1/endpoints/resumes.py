from pathlib import Path
from typing import Final
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_resume_repository, get_resume_scoring_service
from app.application.services.resume_scoring import ResumeScoringService
from app.domain.entities.job_description import JobDescription
from app.domain.entities.resume import Resume
from app.core.config import get_settings
from app.infrastructure.db.session import get_db_session
from app.infrastructure.repositories.resume_repository import ResumeRepository
from app.schemas.resume import (
    JobDescriptionInput,
    ResumeRead,
    ResumeScoreRequest,
    ResumeScoreResponse,
    ScoreCardResponse,
    ResumeUploadResponse,
)

router = APIRouter()

_ALLOWED_RESUME_TYPES: Final[set[str]] = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
_ALLOWED_SUFFIXES: Final[set[str]] = {".pdf", ".doc", ".docx"}


@router.post("/upload", response_model=ResumeUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume_file(file: UploadFile = File(...)) -> ResumeUploadResponse:
    if file.content_type not in _ALLOWED_RESUME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a PDF or Word document",
        )

    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in _ALLOWED_SUFFIXES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file extension",
        )

    settings = get_settings()
    target_dir = Path(settings.upload_dir)
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / f"{uuid4().hex}{suffix}"

    contents = await file.read()
    target_path.write_bytes(contents)
    await file.close()

    base_url = str(settings.public_base_url).rstrip("/")
    file_url = f"{base_url}/uploads/{target_path.name}"
    return ResumeUploadResponse(file_url=file_url)


@router.post("/score", response_model=ResumeScoreResponse, status_code=status.HTTP_201_CREATED)
async def upload_and_score_resume(
    payload: ResumeScoreRequest,
    service: ResumeScoringService = Depends(get_resume_scoring_service),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeScoreResponse:
    resume_entity = _to_resume_entity(payload.resume)
    job_entity = _to_job_description(payload.job_description) if payload.job_description else None
    stored_resume, score_card = await service.upload_and_score(
        resume=resume_entity, job_description=job_entity
    )
    await session.commit()
    resume_read = _to_resume_read(stored_resume)
    score_response = ScoreCardResponse(
        resume_id=score_card.resume_id,
        job_description_id=score_card.job_description_id,
        ats_score=score_card.ats_score,
        keyword_match=score_card.keyword_match,
        formatting_score=score_card.formatting_score,
        overall_score=score_card.overall_score,
        recommendations=list(score_card.recommendations),
    )
    return ResumeScoreResponse(resume=resume_read, score_card=score_response)


@router.get("/", response_model=list[ResumeRead])
async def list_resumes(
    owner_id: int = Query(..., description="User identifier"),
    repository: ResumeRepository = Depends(get_resume_repository),
) -> list[ResumeRead]:
    items = await repository.list_for_owner(owner_id=owner_id)
    return [_to_resume_read(item) for item in items]


@router.get("/{resume_id}", response_model=ResumeRead)
async def get_resume(
    resume_id: int,
    repository: ResumeRepository = Depends(get_resume_repository),
) -> ResumeRead:
    resume = await repository.get(resume_id)
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return _to_resume_read(resume)


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    repository: ResumeRepository = Depends(get_resume_repository),
    session: AsyncSession = Depends(get_db_session),
) -> None:
    resume = await repository.get(resume_id)
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    await repository.delete(resume_id)
    await session.commit()


def _to_resume_entity(payload) -> Resume:
    resume = Resume(
        owner_id=payload.owner_id,
        file_url=str(payload.file_url),
        parsed_text=payload.parsed_text,
        extracted_skills=list(payload.extracted_skills),
        extracted_keywords=list(payload.extracted_keywords),
    )
    return resume


def _to_job_description(payload: JobDescriptionInput) -> JobDescription:
    return JobDescription(
        role_title=payload.role_title,
        company_name=payload.company_name,
        canonical_text=payload.canonical_text,
        required_skills=list(payload.required_skills),
        preferred_skills=list(payload.preferred_skills),
    )


def _to_resume_read(resume: Resume) -> ResumeRead:
    return ResumeRead(
        id=resume.id or 0,
        owner_id=resume.owner_id,
        file_url=resume.file_url,
        parsed_text=resume.parsed_text,
        extracted_skills=list(resume.extracted_skills),
        extracted_keywords=list(resume.extracted_keywords),
        created_at=resume.created_at,
        updated_at=resume.updated_at,
    )
