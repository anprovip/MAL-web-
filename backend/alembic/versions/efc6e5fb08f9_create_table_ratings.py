"""create table ratings

Revision ID: efc6e5fb08f9
Revises: c7a8e5b805b2
Create Date: 2025-03-15 21:53:09.806933

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'efc6e5fb08f9'
down_revision: Union[str, None] = 'c7a8e5b805b2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
   op.create_table('ratings',
        sa.Column('rating_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('my_score', sa.Float(), nullable=True),
        sa.Column('my_status', sa.Integer(), nullable=True),
        sa.Column('create_at', sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.CheckConstraint('my_score BETWEEN 0 AND 10', name='check_my_score_range'),
        sa.CheckConstraint('my_status IN (1, 2, 3, 4, 6)', name='check_my_status_values'),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['anime_id'], ['animes.anime_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('rating_id', name='pk_ratings')
    )
def downgrade() -> None:
    op.drop_table('ratings')
