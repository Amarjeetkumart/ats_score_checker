from app.core.config import get_settings


def test_settings_defaults(monkeypatch) -> None:
    monkeypatch.setenv("SECRET_KEY", "test-secret")
    get_settings.cache_clear()
    settings = get_settings()
    assert settings.app_name == "ATS Resume Score Checker"
    assert settings.api_v1_prefix == "/api/v1"
