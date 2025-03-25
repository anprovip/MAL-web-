"""add anime table

Revision ID: 9d5e896278b8
Revises: 2a603bd04c08
Create Date: 2025-03-16 14:04:04.327499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9d5e896278b8'
down_revision: Union[str, None] = '2a603bd04c08'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tạo bảng genres (thể loại)
    op.create_table(
        'genres',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Tạo bảng themes (chủ đề)
    op.create_table(
        'themes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Tạo bảng demographics (nhân khẩu học)
    op.create_table(
        'demographics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Tạo bảng producers (nhà sản xuất)
    op.create_table(
        'producers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Tạo bảng licensors (đơn vị cấp phép)
    op.create_table(
        'licensors',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Tạo bảng studios (xưởng phim)
    op.create_table(
        'studios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Tạo bảng chính - anime
    op.create_table(
        'anime',
        sa.Column('mal_id', sa.Integer(), nullable=False),
        sa.Column('url', sa.String(length=255), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('title_english', sa.String(length=255), nullable=True),
        sa.Column('title_japanese', sa.String(length=255), nullable=True),
        sa.Column('type', sa.String(length=50), nullable=True),
        sa.Column('source', sa.String(length=100), nullable=True),
        sa.Column('episodes', sa.Float(), nullable=True),
        sa.Column('status', sa.String(length=100), nullable=True),
        sa.Column('airing', sa.Boolean(), nullable=True),
        sa.Column('duration', sa.String(length=100), nullable=True),
        sa.Column('rating', sa.String(length=100), nullable=True),
        sa.Column('popularity', sa.Integer(), nullable=True),
        sa.Column('favorites', sa.Integer(), nullable=True),
        sa.Column('season', sa.String(length=50), nullable=True),
        sa.Column('year', sa.Float(), nullable=True),
        sa.Column('approved', sa.Boolean(), nullable=True),
        sa.Column('background', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(length=255), nullable=True),
        sa.Column('small_image_url', sa.String(length=255), nullable=True),
        sa.Column('large_image_url', sa.String(length=255), nullable=True),
        sa.Column('webp_image_url', sa.String(length=255), nullable=True),
        sa.Column('webp_small_image_url', sa.String(length=255), nullable=True),
        sa.Column('webp_large_image_url', sa.String(length=255), nullable=True),
        sa.Column('trailer_youtube_id', sa.String(length=50), nullable=True),
        sa.Column('trailer_url', sa.String(length=255), nullable=True),
        sa.Column('trailer_embed_url', sa.String(length=255), nullable=True),
        sa.Column('title_synonyms', sa.Text(), nullable=True),  # Lưu trữ dưới dạng danh sách được phân tách bằng dấu phẩy
        sa.Column('title_spanish', sa.String(length=255), nullable=True),
        sa.Column('title_german', sa.String(length=255), nullable=True),
        sa.Column('title_default', sa.String(length=255), nullable=True),
        sa.Column('title_french', sa.String(length=255), nullable=True),
        sa.Column('aired_from', sa.DateTime(), nullable=True),
        sa.Column('aired_to', sa.DateTime(), nullable=True),
        sa.Column('aired_string', sa.String(length=100), nullable=True),
        sa.Column('aired_from_day', sa.Integer(), nullable=True),
        sa.Column('aired_from_month', sa.Integer(), nullable=True),
        sa.Column('aired_from_year', sa.Integer(), nullable=True),
        sa.Column('aired_to_day', sa.Float(), nullable=True),
        sa.Column('aired_to_month', sa.Float(), nullable=True),
        sa.Column('aired_to_year', sa.Float(), nullable=True),
        sa.Column('broadcast_day', sa.String(length=20), nullable=True),
        sa.Column('broadcast_time', sa.String(length=20), nullable=True),
        sa.Column('broadcast_timezone', sa.String(length=50), nullable=True),
        sa.Column('broadcast_string', sa.String(length=100), nullable=True),
        sa.Column('synopsis', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('mal_id')
    )

    #Tạo bảng liên kết anime_genres
    op.create_table(
        'anime_genres',
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('genre_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['anime_id'], ['anime.mal_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['genre_id'], ['genres.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('anime_id', 'genre_id')
    )

    # Tạo bảng liên kết anime_themes
    op.create_table(
        'anime_themes',
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('theme_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['anime_id'], ['anime.mal_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['theme_id'], ['themes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('anime_id', 'theme_id')
    )

    # Tạo bảng liên kết anime_demographics
    op.create_table(
        'anime_demographics',
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('demographic_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['anime_id'], ['anime.mal_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['demographic_id'], ['demographics.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('anime_id', 'demographic_id')
    )

    # Tạo bảng liên kết anime_producers
    op.create_table(
        'anime_producers',
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('producer_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['anime_id'], ['anime.mal_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['producer_id'], ['producers.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('anime_id', 'producer_id')
    )

    # Tạo bảng liên kết anime_licensors
    op.create_table(
        'anime_licensors',
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('licensor_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['anime_id'], ['anime.mal_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['licensor_id'], ['licensors.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('anime_id', 'licensor_id')
    )

    # Tạo bảng liên kết anime_studios
    op.create_table(
        'anime_studios',
        sa.Column('anime_id', sa.Integer(), nullable=False),
        sa.Column('studio_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['anime_id'], ['anime.mal_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['studio_id'], ['studios.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('anime_id', 'studio_id')
    )



def downgrade() -> None:
    """Downgrade schema."""
    # Xóa các bảng liên kết
    op.drop_table('anime_studios')
    op.drop_table('anime_licensors')
    op.drop_table('anime_producers')
    op.drop_table('anime_demographics')
    op.drop_table('anime_themes')
    op.drop_table('anime_genres')

    # Xóa bảng chính
    op.drop_table('anime')

    # Xóa các bảng phụ
    op.drop_table('studios')
    op.drop_table('licensors')
    op.drop_table('producers')
    op.drop_table('demographics')
    op.drop_table('themes')
    op.drop_table('genres')