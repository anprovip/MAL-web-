"""drop_col_anime

Revision ID: 9dcc2aa27a3f
Revises: d8a0197463d9
Create Date: 2025-03-21 18:26:16.436084

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


from alembic import op
import sqlalchemy as sa,inspect
# revision identifiers, used by Alembic.
revision: str = '9dcc2aa27a3f'
down_revision: Union[str, None] = 'd8a0197463d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)  # Sửa lỗi ở đây

    columns = {col['name'] for col in inspector.get_columns('anime')}  # Lấy danh sách cột hiện có

    if 'score' in columns:
        op.drop_column('anime', 'score')
    if 'scored_by' in columns:
        op.drop_column('anime', 'scored_by')
    if 'rank' in columns:
        op.drop_column('anime', 'rank')
    if 'members' in columns:
        op.drop_column('anime', 'members')
