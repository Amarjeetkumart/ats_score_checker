# ATS Resume Score Checker

Production-ready Applicant Tracking System (ATS) resume evaluation platform with a FastAPI backend, PostgreSQL database, and React + Tailwind CSS frontend.

## Architecture

- **Backend**: FastAPI with clean domain/application layers, PostgreSQL via SQLAlchemy, async I/O, JWT auth, analytics aggregation.
- **Frontend**: React (Vite + TypeScript) with Tailwind UI, Zustand state, protected routes, resume scoring dashboard.
- **Messaging / Workers**: Celery and Redis placeholders for asynchronous processing.

## Prerequisites

- Python 3.11+
- Node.js 20.19+ (Vite requires >=20.19; current env 20.16 emits warnings)
- PostgreSQL and Redis (local or managed)

## Backend Setup

```bash
cd backend
../.venv/bin/poetry install
cp .env.example .env  # update secrets and database URLs
../.venv/bin/poetry run alembic upgrade head  # once migrations are added
../.venv/bin/poetry run uvicorn app.main:app --reload
```

### Key environment variables

| Variable | Description |
| --- | --- |
| `SECRET_KEY` | JWT signing secret |
| `POSTGRES_*` | Database connection parameters |
| `REDIS_URL` | Redis endpoint for Celery + caching |
| `OPENAI_API_KEY` | Optional LLM integrations |

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` (see `.env.example`) to point at the FastAPI server (default `http://localhost:8000`).

## VS Code Tasks

- **Run FastAPI backend**: launches `uvicorn` via Poetry inside `backend/`.

## Testing & Quality

```bash
cd backend
../.venv/bin/poetry run pytest
npm run build  # Type checking + production build
```

## Project Structure Highlights

- `backend/app/core` – configuration and logging
- `backend/app/domain` – business entities
- `backend/app/application` – use cases and services
- `backend/app/infrastructure` – persistence, security, integrations
- `backend/app/api` – versioned FastAPI routers and dependencies
- `frontend/src` – React app with layout, routing, services, validation

## Next Steps

- Add Alembic migrations and SQL queries for analytics materialization.
- Extend resume parsing to ingest files (current API expects pre-parsed metadata).
- Implement background workers for heavy processing via Celery.
