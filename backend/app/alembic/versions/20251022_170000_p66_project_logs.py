"""P66: Add project log paths

Revision ID: 20251022_170000
Revises: 20251021_010000
Create Date: 2025-10-22 17:00:00

Adds fields for P66 project operational and extended logs
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20251022_170000'
down_revision = '20251021_010000'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add log paths and rotation timestamp to projects table"""
    # Add log_operational_path column
    op.execute("""
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS log_operational_path TEXT
    """)
    
    # Add log_extended_path column
    op.execute("""
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS log_extended_path TEXT
    """)
    
    # Add log_last_rotated_at column
    op.execute("""
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS log_last_rotated_at TIMESTAMPTZ
    """)
    
    # Add comment
    op.execute("""
        COMMENT ON COLUMN projects.log_operational_path IS 'P66: Path to operational log (50-150 lines, last 5 steps)'
    """)
    
    op.execute("""
        COMMENT ON COLUMN projects.log_extended_path IS 'P66: Path to extended log (full history, ADR, diagrams)'
    """)
    
    op.execute("""
        COMMENT ON COLUMN projects.log_last_rotated_at IS 'P66: Timestamp of last log rotation (operational->extended)'
    """)


def downgrade() -> None:
    """Remove log paths and rotation timestamp from projects table"""
    op.execute("ALTER TABLE projects DROP COLUMN IF EXISTS log_operational_path")
    op.execute("ALTER TABLE projects DROP COLUMN IF EXISTS log_extended_path")
    op.execute("ALTER TABLE projects DROP COLUMN IF EXISTS log_last_rotated_at")

