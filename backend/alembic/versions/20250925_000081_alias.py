"""
Alias migration to resolve historical down_revision '20250925_000081'.

This migration is a no-op and exists solely to bridge older revisions that
referenced the plain identifier without a suffix. It points to the actual
revision present in the repository.

Revision ID: 20250925_000081
Revises: 20250925_000081_rs_nightly_reports
Create Date: 2025-09-25 00:00:00
"""

from __future__ import annotations

# Alembic identifiers
revision = "20250925_000081"
down_revision = "20250925_000081_rs_nightly_reports"
branch_labels = None
depends_on = None


def upgrade() -> None:  # type: ignore[override]
    # No-op: alias only
    pass


def downgrade() -> None:  # type: ignore[override]
    # No-op: keep alias in place
    pass


