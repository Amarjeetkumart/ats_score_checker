from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db import models
from app.schemas.analytics import AnalyticsSummary, KeywordFrequency, ScoreTrendPoint


class AnalyticsService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def summary_for_owner(self, owner_id: int) -> AnalyticsSummary:
        resumes = await self._fetch_resumes(owner_id)
        score_cards = await self._fetch_score_cards(owner_id)
        total_resumes = len(resumes)
        average_score = (
            sum(card.overall_score for card in score_cards) / len(score_cards)
            if score_cards
            else 0.0
        )
        keyword_counter = Counter()
        for resume in resumes:
            keyword_counter.update(resume.extracted_keywords or [])
        keywords = [KeywordFrequency(keyword=key, count=count) for key, count in keyword_counter.most_common(20)]
        score_trends = self._build_score_trends(score_cards)
        return AnalyticsSummary(
            total_resumes=total_resumes,
            average_score=round(average_score, 2),
            keywords=keywords,
            score_trends=score_trends,
        )

    async def _fetch_resumes(self, owner_id: int) -> list[models.ResumeModel]:
        result = await self._session.execute(
            select(models.ResumeModel).where(models.ResumeModel.owner_id == owner_id)
        )
        return list(result.scalars().all())

    async def _fetch_score_cards(self, owner_id: int) -> list[models.ScoreCardModel]:
        result = await self._session.execute(
            select(models.ScoreCardModel)
            .join(models.ResumeModel, models.ScoreCardModel.resume_id == models.ResumeModel.id)
            .where(models.ResumeModel.owner_id == owner_id)
        )
        return list(result.scalars().all())

    def _build_score_trends(self, score_cards: list[models.ScoreCardModel]) -> list[ScoreTrendPoint]:
        buckets: defaultdict[str, list[models.ScoreCardModel]] = defaultdict(list)
        for card in score_cards:
            day = (card.generated_at or datetime.utcnow()).strftime("%Y-%m-%d")
            buckets[day].append(card)
        trend_points: list[ScoreTrendPoint] = []
        for day, cards in sorted(buckets.items()):
            average = sum(card.overall_score for card in cards) / len(cards)
            trend_points.append(
                ScoreTrendPoint(
                    date=datetime.fromisoformat(day),
                    average_score=round(average, 2),
                    submissions=len(cards),
                )
            )
        return trend_points
