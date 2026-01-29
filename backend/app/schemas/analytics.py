from datetime import datetime
from typing import List

from pydantic import BaseModel


class ScoreTrendPoint(BaseModel):
    date: datetime
    average_score: float
    submissions: int


class KeywordFrequency(BaseModel):
    keyword: str
    count: int


class AnalyticsSummary(BaseModel):
    total_resumes: int
    average_score: float
    keywords: List[KeywordFrequency]
    score_trends: List[ScoreTrendPoint]
