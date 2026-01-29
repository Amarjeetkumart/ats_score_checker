from datetime import datetime
from typing import List

from pydantic import AnyHttpUrl, BaseModel, Field


class JobDescriptionInput(BaseModel):
    role_title: str = Field(..., max_length=255)
    company_name: str | None = Field(default=None, max_length=255)
    canonical_text: str | None = None
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)


class ResumeCreate(BaseModel):
    owner_id: int
    file_url: AnyHttpUrl
    parsed_text: str | None = None
    extracted_skills: List[str] = Field(default_factory=list)
    extracted_keywords: List[str] = Field(default_factory=list)


class ResumeRead(ResumeCreate):
    id: int
    created_at: datetime
    updated_at: datetime


class ScoreCardResponse(BaseModel):
    resume_id: int
    job_description_id: int | None
    ats_score: float
    keyword_match: float
    formatting_score: float
    overall_score: float
    recommendations: List[str]


class ResumeScoreRequest(BaseModel):
    resume: ResumeCreate
    job_description: JobDescriptionInput | None = None


class ResumeScoreResponse(BaseModel):
    resume: ResumeRead
    score_card: ScoreCardResponse


class ResumeUploadResponse(BaseModel):
    file_url: AnyHttpUrl
