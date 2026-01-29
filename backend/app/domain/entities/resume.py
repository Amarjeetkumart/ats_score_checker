from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import List


@dataclass(slots=True)
class Resume:
    owner_id: int
    file_url: str
    parsed_text: str | None = None
    extracted_skills: List[str] = field(default_factory=list)
    extracted_keywords: List[str] = field(default_factory=list)
    id: int | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
