from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ATS Resume Score Checker"
    environment: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    secret_key: str
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 60 * 24 * 7
    algorithm: str = "HS256"

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_db: str = "ats"

    redis_url: str = "redis://localhost:6379/0"

    cors_allowed_origins: List[AnyHttpUrl] = [
        AnyHttpUrl("http://localhost:5173"),
        AnyHttpUrl("http://localhost:3000"),
        AnyHttpUrl("http://localhost:5173/register"),
    ]

    public_base_url: AnyHttpUrl = AnyHttpUrl("http://localhost:8000")
    upload_dir: str = "storage/uploads"

    enable_docs: bool = True

    openai_api_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
