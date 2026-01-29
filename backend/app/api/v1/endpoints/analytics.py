from fastapi import APIRouter, Depends, Query

from app.api.dependencies import get_analytics_service
from app.application.services.analytics import AnalyticsService
from app.schemas.analytics import AnalyticsSummary

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummary)
async def get_summary(
    owner_id: int = Query(..., description="User identifier"),
    service: AnalyticsService = Depends(get_analytics_service),
) -> AnalyticsSummary:
    return await service.summary_for_owner(owner_id)
