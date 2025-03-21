"""add_user_info_mal_table

Revision ID: ea6d0033eb35
Revises: 2e08a473628d
Create Date: 2025-03-20 18:03:36.899326

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ea6d0033eb35'
down_revision: Union[str, None] = '2e08a473628d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('user_stats',
        sa.Column('user_stats_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('total_anime_rated', sa.Integer(), nullable=True, server_default=sa.text('0')), 
        sa.Column('total_anime', sa.Integer(), nullable=True, server_default=sa.text('0')), 
        sa.Column('mean_score', sa.Float(), nullable=True, server_default=sa.text('0')), 
        sa.PrimaryKeyConstraint('user_stats_id', name='pk_user_stats'),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='CASCADE'),
    )   

def downgrade() -> None:
    # op.drop_table('user_stats')
    pass
