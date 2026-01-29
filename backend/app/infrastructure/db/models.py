from __future__ import annotations

from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.infrastructure.db.base import Base


class ResumeModel(Base):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_id: Mapped[int] = mapped_column(index=True)
    file_url: Mapped[str] = mapped_column(String(512))
    parsed_text: Mapped[str | None] = mapped_column(Text(), nullable=True)
    extracted_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    extracted_keywords: Mapped[list[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    score_cards: Mapped[list["ScoreCardModel"]] = relationship(back_populates="resume")


class JobDescriptionModel(Base):
    __tablename__ = "job_descriptions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    role_title: Mapped[str] = mapped_column(String(255))
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    canonical_text: Mapped[str | None] = mapped_column(Text(), nullable=True)
    required_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    preferred_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    score_cards: Mapped[list["ScoreCardModel"]] = relationship(back_populates="job_description")


class ScoreCardModel(Base):
    __tablename__ = "score_cards"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"))
    job_description_id: Mapped[int | None] = mapped_column(
        ForeignKey("job_descriptions.id", ondelete="SET NULL"), nullable=True
    )
    ats_score: Mapped[float] = mapped_column()
    keyword_match: Mapped[float] = mapped_column()
    formatting_score: Mapped[float] = mapped_column()
    overall_score: Mapped[float] = mapped_column()
    recommendations: Mapped[list[str]] = mapped_column(JSON, default=list)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    resume: Mapped[ResumeModel] = relationship(back_populates="score_cards")
    job_description: Mapped[JobDescriptionModel] = relationship(back_populates="score_cards")


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
