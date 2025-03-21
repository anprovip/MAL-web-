"""add_col_to_users

Revision ID: 2e08a473628d
Revises: a744fd0ed449
Create Date: 2025-03-20 17:45:09.578580

"""
import inspect
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2e08a473628d'
down_revision: Union[str, None] = 'a744fd0ed449'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from sqlalchemy import inspect
import sqlalchemy as sa
from alembic import op

def upgrade():
    pass
    # conn = op.get_bind()
    # inspector = inspect(conn)
    # columns = {col['name'] for col in inspector.get_columns('users')}  # Chuyển danh sách thành set để kiểm tra nhanh hơn

    # if 'total_anime' not in columns:
    #     op.add_column('users', sa.Column('total_anime', sa.Integer(), nullable=True, server_default=sa.text('0')))

    # if 'mean_score' not in columns:
    #     op.add_column('users', sa.Column('mean_score', sa.Float(), nullable=True, server_default=sa.text('0.0')))

def downgrade():
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = {col['name'] for col in inspector.get_columns('users')}  # Lấy danh sách cột hiện có

    if 'total_anime' in columns:
        op.drop_column('users', 'total_anime')

    if 'mean_score' in columns:
        op.drop_column('users', 'mean_score')
    pass

    
