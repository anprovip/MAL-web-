
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, Float, Text, DateTime, CheckConstraint

from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import TIMESTAMP
from .database import Base

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    user_watching = Column(Integer, nullable=True, server_default=text('0'))
    user_completed = Column(Integer, nullable=True, server_default=text('0'))
    user_onhold = Column(Integer, nullable=True, server_default=text('0'))
    user_dropped = Column(Integer, nullable=True, server_default=text('0'))
    user_plantowatch = Column(Integer, nullable=True, server_default=text('0'))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))

class Rating(Base):
    __tablename__ = "ratings"
    rating_id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    anime_id= Column(Integer, ForeignKey("anime.mal_id", ondelete="CASCADE"), nullable=False)
    my_score = Column(Integer, CheckConstraint("my_score BETWEEN 0 AND 10"), nullable=False,server_default=text('0'))
    my_status = Column(Integer, CheckConstraint("my_status IN (1,2,3,4,5)"), nullable=False)
    created_at=  Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
class UserStats(Base):
    __tablename__ = "user_stats"
    user_stats_id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    total_anime = Column(Integer, nullable=False, server_default=text('0'))
    total_anime_rated = Column(Integer, nullable=False, server_default=text('0'))
    mean_score = Column(Float, nullable=False, server_default=text('0'))

class MalStats(Base):
    __tablename__ = "mal_stats"
    mal_stats_id = Column(Integer, primary_key=True, nullable=False)
    anime_id = Column(Integer, ForeignKey("anime.mal_id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=True, server_default=text('0'))
    scored_by = Column(Integer, nullable=True, server_default=text('0'))
    rank = Column(Integer, nullable=True, server_default=text('0'))
    members = Column(Integer, nullable=True, server_default=text('0'))
    popularity = Column(Integer, nullable=True, server_default=text('0'))
    anime = relationship("Anime", back_populates="mal_stats")


# Bảng liên kết anime_genres
anime_genres = Table(
    'anime_genres',
    Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.mal_id', ondelete='CASCADE'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id', ondelete='CASCADE'), primary_key=True)
)

# Bảng liên kết anime_themes
anime_themes = Table(
    'anime_themes',
    Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.mal_id', ondelete='CASCADE'), primary_key=True),
    Column('theme_id', Integer, ForeignKey('themes.id', ondelete='CASCADE'), primary_key=True)
)

# Bảng liên kết anime_demographics
anime_demographics = Table(
    'anime_demographics',
    Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.mal_id', ondelete='CASCADE'), primary_key=True),
    Column('demographic_id', Integer, ForeignKey('demographics.id', ondelete='CASCADE'), primary_key=True)
)

# Bảng liên kết anime_producers
anime_producers = Table(
    'anime_producers',
    Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.mal_id', ondelete='CASCADE'), primary_key=True),
    Column('producer_id', Integer, ForeignKey('producers.id', ondelete='CASCADE'), primary_key=True)
)

# Bảng liên kết anime_licensors
anime_licensors = Table(
    'anime_licensors',
    Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.mal_id', ondelete='CASCADE'), primary_key=True),
    Column('licensor_id', Integer, ForeignKey('licensors.id', ondelete='CASCADE'), primary_key=True)
)

# Bảng liên kết anime_studios
anime_studios = Table(
    'anime_studios',
    Base.metadata,
    Column('anime_id', Integer, ForeignKey('anime.mal_id', ondelete='CASCADE'), primary_key=True),
    Column('studio_id', Integer, ForeignKey('studios.id', ondelete='CASCADE'), primary_key=True)
)


class Genre(Base):
    __tablename__ = 'genres'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    
    # Relationship
    animes = relationship('Anime', secondary=anime_genres, back_populates='genres')


class Theme(Base):
    __tablename__ = 'themes'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    
    # Relationship
    animes = relationship('Anime', secondary=anime_themes, back_populates='themes')


class Demographic(Base):
    __tablename__ = 'demographics'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    
    # Relationship
    animes = relationship('Anime', secondary=anime_demographics, back_populates='demographics')


class Producer(Base):
    __tablename__ = 'producers'

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False, unique=True)
    
    # Relationship
    animes = relationship('Anime', secondary=anime_producers, back_populates='producers')


class Licensor(Base):
    __tablename__ = 'licensors'

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False, unique=True)
    
    # Relationship
    animes = relationship('Anime', secondary=anime_licensors, back_populates='licensors')


class Studio(Base):
    __tablename__ = 'studios'

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False, unique=True)
    
    # Relationship
    animes = relationship('Anime', secondary=anime_studios, back_populates='studios')


class Anime(Base):
    __tablename__ = 'anime'

    # Thông tin chính
    mal_id = Column(Integer, primary_key=True)
    url = Column(String(255))
    title = Column(String(255), nullable=False, index=True)
    title_english = Column(String(255))
    title_japanese = Column(String(255))
    type = Column(String(50))
    source = Column(String(100))
    episodes = Column(Float)
    status = Column(String(100))
    airing = Column(Boolean)
    duration = Column(String(100))
    rating = Column(String(100))
    
    # Thống kê
   
    popularity = Column(Integer, index=True)

    favorites = Column(Integer)
    
    # Thời gian
    season = Column(String(50), index=True)
    year = Column(Float, index=True)
    
    # Thông tin khác
    approved = Column(Boolean)
    background = Column(Text)
    
    # Hình ảnh
    image_url = Column(String(255))
    small_image_url = Column(String(255))
    large_image_url = Column(String(255))
    webp_image_url = Column(String(255))
    webp_small_image_url = Column(String(255))
    webp_large_image_url = Column(String(255))
    
    # Trailer
    trailer_youtube_id = Column(String(50))
    trailer_url = Column(String(255))
    trailer_embed_url = Column(String(255))
    
    # Tiêu đề thay thế
    title_synonyms = Column(Text)  # Lưu trữ dưới dạng danh sách được phân tách bằng dấu phẩy
    title_spanish = Column(String(255))
    title_german = Column(String(255))
    title_default = Column(String(255))
    title_french = Column(String(255))
    
    # Thông tin phát sóng
    aired_from = Column(DateTime)
    aired_to = Column(DateTime)
    aired_string = Column(String(100))
    aired_from_day = Column(Integer)
    aired_from_month = Column(Integer)
    aired_from_year = Column(Integer)
    aired_to_day = Column(Float)
    aired_to_month = Column(Float)
    aired_to_year = Column(Float)
    broadcast_day = Column(String(20))
    broadcast_time = Column(String(20))
    broadcast_timezone = Column(String(50))
    broadcast_string = Column(String(100))
    
    # Nội dung
    synopsis = Column(Text)
    
    # Thời gian hệ thống
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'), onupdate=text('now()'))
    
    # Relationships
    genres = relationship('Genre', secondary=anime_genres, back_populates='animes')
    themes = relationship('Theme', secondary=anime_themes, back_populates='animes')
    demographics = relationship('Demographic', secondary=anime_demographics, back_populates='animes')
    producers = relationship('Producer', secondary=anime_producers, back_populates='animes')
    licensors = relationship('Licensor', secondary=anime_licensors, back_populates='animes')
    studios = relationship('Studio', secondary=anime_studios, back_populates='animes')
    mal_stats = relationship("MalStats", back_populates="anime", uselist=False, cascade="all, delete-orphan")
