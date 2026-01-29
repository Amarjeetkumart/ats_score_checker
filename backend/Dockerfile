# syntax=docker/dockerfile:1.6

FROM python:3.11-slim AS builder

ENV POETRY_VERSION=1.8.3 \
    POETRY_NO_INTERACTION=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \ 
    && apt-get install -y --no-install-recommends build-essential \ 
    && rm -rf /var/lib/apt/lists/*

RUN pip install "poetry==${POETRY_VERSION}"

COPY pyproject.toml poetry.lock ./
RUN poetry export --without-hashes --format=requirements.txt --output=requirements.txt
RUN pip wheel --no-cache-dir --wheel-dir=/wheels -r requirements.txt

FROM python:3.11-slim AS runtime

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH="/home/appuser/.local/bin:${PATH}"

WORKDIR /app

RUN useradd --create-home --shell /sbin/nologin appuser

COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/*

COPY app ./app
COPY alembic.ini ./alembic.ini
COPY migrations ./migrations
COPY scripts ./scripts
COPY README.md ./README.md

RUN chmod +x scripts/start.sh \ 
    && mkdir -p storage/uploads \ 
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["/bin/sh", "scripts/start.sh"]
