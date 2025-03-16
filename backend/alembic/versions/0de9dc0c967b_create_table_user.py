"""create table user

Revision ID: 0de9dc0c967b
Revises: 
Create Date: 2025-03-15 21:52:18.409508

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0de9dc0c967b'
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
        sa.PrimaryKeyConstraint('user_id', name='pk_users'),
        sa.UniqueConstraint('username', name='unique_username'),
        sa.UniqueConstraint('email', name='unique_email'),
    )
                    


def downgrade() -> None:
    op.drop_table('users')
    

