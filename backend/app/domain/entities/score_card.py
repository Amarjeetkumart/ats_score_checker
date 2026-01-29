from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(slots=True)
class ScoreCard:
    resume_id: int
    job_description_id: int | None
    ats_score: float
    keyword_match: float
    formatting_score: float
    overall_score: float
    recommendations: list[str] = field(default_factory=list)
    id: int | None = None
    generated_at: datetime = field(default_factory=datetime.utcnow)
