from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import List


@dataclass(slots=True)
class JobDescription:
    role_title: str
    company_name: str | None = None
    canonical_text: str | None = None
    required_skills: List[str] = field(default_factory=list)
    preferred_skills: List[str] = field(default_factory=list)
    id: int | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
