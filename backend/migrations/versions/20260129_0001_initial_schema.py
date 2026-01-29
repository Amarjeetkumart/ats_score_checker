"""Initial database schema"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260129_0001"
down_revision: str | None = None
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    op.create_table(
        "job_descriptions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("role_title", sa.String(length=255), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("canonical_text", sa.Text(), nullable=True),
        sa.Column("required_skills", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("preferred_skills", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    op.create_table(
        "resumes",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("file_url", sa.String(length=512), nullable=False),
        sa.Column("parsed_text", sa.Text(), nullable=True),
        sa.Column("extracted_skills", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("extracted_keywords", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
            server_onupdate=sa.func.now(),
        ),
    )
    op.create_index("ix_resumes_owner_id", "resumes", ["owner_id"], unique=False)

    op.create_table(
        "score_cards",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("resume_id", sa.Integer(), nullable=False),
        sa.Column("job_description_id", sa.Integer(), nullable=True),
        sa.Column("ats_score", sa.Float(), nullable=False),
        sa.Column("keyword_match", sa.Float(), nullable=False),
        sa.Column("formatting_score", sa.Float(), nullable=False),
        sa.Column("overall_score", sa.Float(), nullable=False),
        sa.Column("recommendations", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column(
            "generated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.ForeignKeyConstraint(["resume_id"], ["resumes.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["job_description_id"], ["job_descriptions.id"], ondelete="SET NULL"),
    )


def downgrade() -> None:
    op.drop_table("score_cards")
    op.drop_index("ix_resumes_owner_id", table_name="resumes")
    op.drop_table("resumes")
    op.drop_table("job_descriptions")
    op.drop_table("users")
