"""add user table

Revision ID: 2a603bd04c08
Revises: 
Create Date: 2025-03-16 14:03:10.267468

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a603bd04c08'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('users',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('user_watching', sa.Integer(), nullable=True, server_default=sa.text('0')),
        sa.Column('user_completed', sa.Integer(), nullable=True, server_default=sa.text('0')),
        sa.Column('user_onhold', sa.Integer(), nullable=True, server_default=sa.text('0')),
        sa.Column('user_dropped', sa.Integer(), nullable=True, server_default=sa.text('0')),
        sa.Column('user_plantowatch', sa.Integer(), nullable=True, server_default=sa.text('0')), 
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('user_id', name='pk_users'),
        sa.UniqueConstraint('username', name='unique_username'),
        sa.UniqueConstraint('email', name='unique_email'),

    )
                    


def downgrade() -> None:
    op.drop_table('users')