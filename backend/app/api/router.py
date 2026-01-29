from fastapi import APIRouter

from app.api.v1.endpoints import analytics, auth, resumes

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
