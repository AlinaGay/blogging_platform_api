"""Create posts table

Revision ID: 001
Revises:
Create Date: 2026-03-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "posts",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("summary", sa.String(500), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.CheckConstraint("char_length(title) <= 200", name="ck_post_title_length"),
        sa.CheckConstraint("char_length(body) <= 50000", name="ck_post_body_length"),
        sa.CheckConstraint("char_length(summary) <= 500", name="ck_post_summary_length"),
    )
    op.create_index("ix_posts_created_at", "posts", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_posts_created_at", table_name="posts")
    op.drop_table("posts")
