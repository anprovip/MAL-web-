"""add_mal_stats_table

Revision ID: 58971ff30535
Revises: ea6d0033eb35
Create Date: 2025-03-20 18:40:34.576727

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58971ff30535'
down_revision: Union[str, None] = 'ea6d0033eb35'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table('mal_stats',
        sa.Column('mal_stats_id', sa.Integer(), nullable=False),
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('score', sa.Float(), nullable=True, server_default=sa.text('0')), 
        sa.Column('scored_by', sa.Integer(), nullable=True, server_default=sa.text('0')),
        sa.Column('rank', sa.Integer(), nullable=True, server_default=sa.text('0')), 
        sa.Column('members', sa.Integer(), nullable=True, server_default=sa.text('0')),
        sa.PrimaryKeyConstraint('mal_stats_id', name='pk_mal_stats'),
        sa.ForeignKeyConstraint(['anime_id'], ['anime.mal_id'], ondelete='CASCADE'),
    )   

def downgrade() -> None:
    # op.drop_table('mal_stats')
    pass
