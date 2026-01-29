from __future__ import annotations

from collections import Counter
from typing import Iterable

from app.application.interfaces.resume_repository import AbstractResumeRepository
from app.domain.entities.job_description import JobDescription
from app.domain.entities.resume import Resume
from app.domain.entities.score_card import ScoreCard

KEYWORD_WEIGHT = 0.5
FORMATTING_WEIGHT = 0.2
EXPERIENCE_WEIGHT = 0.3


class ResumeScoringService:
    def __init__(self, repository: AbstractResumeRepository) -> None:
        self._repository = repository

    async def score_existing_resume(
        self, *, resume_id: int, job_description: JobDescription | None
    ) -> ScoreCard:
        resume = await self._repository.get(resume_id)
        if resume is None:
            raise ValueError("Resume not found")
        return self._build_score_card(resume=resume, job_description=job_description)

    async def upload_and_score(
        self, *, resume: Resume, job_description: JobDescription | None
    ) -> tuple[Resume, ScoreCard]:
        stored = await self._repository.add(resume)
        score_card = self._build_score_card(resume=stored, job_description=job_description)
        return stored, score_card

    def _build_score_card(
        self, *, resume: Resume, job_description: JobDescription | None
    ) -> ScoreCard:
        keyword_score = self._calculate_keyword_score(resume, job_description)
        formatting_score = self._estimate_formatting_score(resume)
        experience_score = self._estimate_experience_alignment(resume, job_description)
        overall = (
            keyword_score * KEYWORD_WEIGHT
            + formatting_score * FORMATTING_WEIGHT
            + experience_score * EXPERIENCE_WEIGHT
        )
        recommendations = self._collect_recommendations(
            keyword_score=keyword_score,
            formatting_score=formatting_score,
            experience_score=experience_score,
        )
        return ScoreCard(
            resume_id=resume.id or 0,
            job_description_id=job_description.id if job_description else None,
            ats_score=overall,
            keyword_match=keyword_score,
            formatting_score=formatting_score,
            overall_score=overall,
            recommendations=recommendations,
        )

    def _calculate_keyword_score(
        self, resume: Resume, job_description: JobDescription | None
    ) -> float:
        if not job_description:
            return 0.5
        resume_keywords = set(map(str.lower, resume.extracted_keywords or []))
        description_keywords = self._collect_job_keywords(job_description)
        if not description_keywords:
            return 0.6
        overlap = resume_keywords & description_keywords
        return round(len(overlap) / len(description_keywords), 4)

    def _collect_job_keywords(self, job_description: JobDescription) -> set[str]:
        aggregated: Iterable[str] = (
            list(job_description.required_skills) + list(job_description.preferred_skills)
        )
        return {item.lower() for item in aggregated if item}

    def _estimate_formatting_score(self, resume: Resume) -> float:
        if not resume.parsed_text:
            return 0.3
        characters = len(resume.parsed_text)
        paragraphs = max(resume.parsed_text.count("\n\n"), 1)
        avg_paragraph = characters / paragraphs
        if avg_paragraph < 400:
            return 0.8
        if avg_paragraph < 800:
            return 0.6
        return 0.4

    def _estimate_experience_alignment(
        self, resume: Resume, job_description: JobDescription | None
    ) -> float:
        if not job_description:
            return 0.5
        resume_terms = Counter(word.lower() for word in (resume.parsed_text or "").split())
        role_terms = Counter(word.lower() for word in (job_description.canonical_text or "").split())
        if not role_terms:
            return 0.55
        overlap = sum(min(resume_terms[token], role_terms[token]) for token in role_terms)
        max_possible = sum(role_terms.values())
        return round(overlap / max_possible, 4)

    def _collect_recommendations(
        self, *, keyword_score: float, formatting_score: float, experience_score: float
    ) -> list[str]:
        recommendations: list[str] = []
        if keyword_score < 0.6:
            recommendations.append("Add more role-specific keywords to improve match.")
        if formatting_score < 0.6:
            recommendations.append("Simplify formatting and ensure consistent section spacing.")
        if experience_score < 0.6:
            recommendations.append("Highlight achievements aligned with the job description.")
        if not recommendations:
            recommendations.append("Resume is well-optimized for the selected job.")
        return recommendations
