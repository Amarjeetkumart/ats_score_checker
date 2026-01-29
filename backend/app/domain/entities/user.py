from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(slots=True)
class User:
    email: str
    hashed_password: str
    full_name: str | None = None
    is_active: bool = True
    id: int | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
