"""create table animes

Revision ID: c7a8e5b805b2
Revises: 0de9dc0c967b
Create Date: 2025-03-15 21:52:42.215624

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c7a8e5b805b2'
down_revision: Union[str, None] = '0de9dc0c967b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('animes',
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('anime_name', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('anime_id', name='pk_animes'),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='CASCADE'),
    )
def downgrade() -> None:
    op.drop_table('animes')
