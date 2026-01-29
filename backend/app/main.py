from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import get_settings
from app.core.logging import setup_logging
from app.infrastructure.db import models  # noqa: F401 - ensure model metadata is registered
from app.infrastructure.db.base import Base
from app.infrastructure.db.session import engine


def create_app() -> FastAPI:
    setup_logging()
    settings = get_settings()
    upload_path = Path(settings.upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
        docs_url="/docs" if settings.enable_docs else None,
        redoc_url="/redoc" if settings.enable_docs else None,
        openapi_url="/openapi.json" if settings.enable_docs else None,
    )
    app.add_middleware(
        CORSMiddleware,
        # allow_origins=[str(origin) for origin in settings.cors_allowed_origins],
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router, prefix=settings.api_v1_prefix)
    app.mount("/uploads", StaticFiles(directory=upload_path), name="uploads")

    @app.on_event("startup")
    async def create_database_tables() -> None:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

    @app.on_event("shutdown")
    async def close_database_connections() -> None:
        await engine.dispose()

    return app


app = create_app()
