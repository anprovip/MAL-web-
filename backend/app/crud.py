from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime
import math

from . import models, schemas


# ---- Genre CRUD ----
def get_genre(db: Session, genre_id: int):
    return db.query(models.Genre).filter(models.Genre.id == genre_id).first()


def get_genre_by_name(db: Session, name: str):
    return db.query(models.Genre).filter(models.Genre.name == name).first()


def get_genres(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Genre).offset(skip).limit(limit).all()


def create_genre(db: Session, genre: schemas.GenreCreate):
    db_genre = models.Genre(name=genre.name)
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre


# ---- Theme CRUD ----
def get_theme(db: Session, theme_id: int):
    return db.query(models.Theme).filter(models.Theme.id == theme_id).first()


def get_theme_by_name(db: Session, name: str):
    return db.query(models.Theme).filter(models.Theme.name == name).first()


def get_themes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Theme).offset(skip).limit(limit).all()


def create_theme(db: Session, theme: schemas.ThemeCreate):
    db_theme = models.Theme(name=theme.name)
    db.add(db_theme)
    db.commit()
    db.refresh(db_theme)
    return db_theme


# ---- Demographic CRUD ----
def get_demographic(db: Session, demographic_id: int):
    return db.query(models.Demographic).filter(models.Demographic.id == demographic_id).first()


def get_demographic_by_name(db: Session, name: str):
    return db.query(models.Demographic).filter(models.Demographic.name == name).first()


def get_demographics(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Demographic).offset(skip).limit(limit).all()


def create_demographic(db: Session, demographic: schemas.DemographicCreate):
    db_demographic = models.Demographic(name=demographic.name)
    db.add(db_demographic)
    db.commit()
    db.refresh(db_demographic)
    return db_demographic


# ---- Producer CRUD ----
def get_producer(db: Session, producer_id: int):
    return db.query(models.Producer).filter(models.Producer.id == producer_id).first()


def get_producer_by_name(db: Session, name: str):
    return db.query(models.Producer).filter(models.Producer.name == name).first()


def get_producers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Producer).offset(skip).limit(limit).all()


def create_producer(db: Session, producer: schemas.ProducerCreate):
    db_producer = models.Producer(name=producer.name)
    db.add(db_producer)
    db.commit()
    db.refresh(db_producer)
    return db_producer


# ---- Licensor CRUD ----
def get_licensor(db: Session, licensor_id: int):
    return db.query(models.Licensor).filter(models.Licensor.id == licensor_id).first()


def get_licensor_by_name(db: Session, name: str):
    return db.query(models.Licensor).filter(models.Licensor.name == name).first()


def get_licensors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Licensor).offset(skip).limit(limit).all()


def create_licensor(db: Session, licensor: schemas.LicensorCreate):
    db_licensor = models.Licensor(name=licensor.name)
    db.add(db_licensor)
    db.commit()
    db.refresh(db_licensor)
    return db_licensor


# ---- Studio CRUD ----
def get_studio(db: Session, studio_id: int):
    return db.query(models.Studio).filter(models.Studio.id == studio_id).first()


def get_studio_by_name(db: Session, name: str):
    return db.query(models.Studio).filter(models.Studio.name == name).first()


def get_studios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Studio).offset(skip).limit(limit).all()


def create_studio(db: Session, studio: schemas.StudioCreate):
    db_studio = models.Studio(name=studio.name)
    db.add(db_studio)
    db.commit()
    db.refresh(db_studio)
    return db_studio


# ---- Anime CRUD ----
def get_anime(db: Session, anime_id: int):
    return db.query(models.Anime).filter(models.Anime.mal_id == anime_id).first()


def get_anime_by_title(db: Session, title: str):
    return db.query(models.Anime).filter(models.Anime.title == title).first()


def get_animes(
    db: Session, 
    skip: int = 0, 
    limit: int = 20,
    title: Optional[str] = None,
    genres: Optional[List[str]] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    season: Optional[str] = None,
    year: Optional[int] = None,
    min_score: Optional[float] = None,
    sort_by: str = "popularity"
) -> Tuple[List[models.Anime], int]:
    query = db.query(models.Anime)
    
    # Apply filters
    if title:
        query = query.filter(models.Anime.title.ilike(f"%{title}%"))
    
    if genres and len(genres) > 0:
        for genre in genres:
            query = query.join(models.Anime.genres).filter(
                models.Genre.name.ilike(f"%{genre}%")
            )
            
    if type:
        query = query.filter(models.Anime.type == type)
        
    if status:
        query = query.filter(models.Anime.status == status)
        
    if season:
        query = query.filter(models.Anime.season == season)
        
    if year:
        query = query.filter(models.Anime.year == year)
        
    if min_score:
        query = query.filter(models.Anime.score >= min_score)
    
    # Get total count first
    total = query.count()
    
    # Apply sorting
    if sort_by == "score":
        query = query.order_by(desc(models.Anime.score))
    elif sort_by == "rank":
        query = query.order_by(models.Anime.rank)
    elif sort_by == "popularity":
        query = query.order_by(models.Anime.popularity)
    elif sort_by == "year":
        query = query.order_by(desc(models.Anime.year))
    else:
        query = query.order_by(models.Anime.title)
    
    # Apply pagination
    animes = query.offset(skip).limit(limit).all()
    
    return animes, total


def create_anime(db: Session, anime: schemas.AnimeCreate):
    # Convert the Pydantic model to a dict, excluding relationship fields
    anime_data = anime.dict(exclude={"genre_ids", "theme_ids", "demographic_ids", 
                                    "producer_ids", "licensor_ids", "studio_ids"})
    
    # Create anime instance
    db_anime = models.Anime(**anime_data)
    
    # Add the anime to the session
    db.add(db_anime)
    db.flush()  # Flush to get the ID without committing
    
    # Add relationships
    if anime.genre_ids:
        for genre_id in anime.genre_ids:
            genre = db.query(models.Genre).filter(models.Genre.id == genre_id).first()
            if genre:
                db_anime.genres.append(genre)
    
    if anime.theme_ids:
        for theme_id in anime.theme_ids:
            theme = db.query(models.Theme).filter(models.Theme.id == theme_id).first()
            if theme:
                db_anime.themes.append(theme)
    
    if anime.demographic_ids:
        for demographic_id in anime.demographic_ids:
            demographic = db.query(models.Demographic).filter(models.Demographic.id == demographic_id).first()
            if demographic:
                db_anime.demographics.append(demographic)
    
    if anime.producer_ids:
        for producer_id in anime.producer_ids:
            producer = db.query(models.Producer).filter(models.Producer.id == producer_id).first()
            if producer:
                db_anime.producers.append(producer)
    
    if anime.licensor_ids:
        for licensor_id in anime.licensor_ids:
            licensor = db.query(models.Licensor).filter(models.Licensor.id == licensor_id).first()
            if licensor:
                db_anime.licensors.append(licensor)
    
    if anime.studio_ids:
        for studio_id in anime.studio_ids:
            studio = db.query(models.Studio).filter(models.Studio.id == studio_id).first()
            if studio:
                db_anime.studios.append(studio)
    
    # Commit changes
    db.commit()
    db.refresh(db_anime)
    return db_anime


def update_anime(db: Session, anime_id: int, anime: schemas.AnimeUpdate):
    db_anime = db.query(models.Anime).filter(models.Anime.mal_id == anime_id).first()
    
    if not db_anime:
        return None
    
    # Update anime attributes
    anime_data = anime.dict(exclude_unset=True, exclude={"genre_ids", "theme_ids", "demographic_ids", 
                                                        "producer_ids", "licensor_ids", "studio_ids"})
    
    for key, value in anime_data.items():
        if value is not None:  # Only update if value is provided
            setattr(db_anime, key, value)
    
    # Update relationships if provided
    if anime.genre_ids is not None:
        db_anime.genres = []
        for genre_id in anime.genre_ids:
            genre = db.query(models.Genre).filter(models.Genre.id == genre_id).first()
            if genre:
                db_anime.genres.append(genre)
    
    if anime.theme_ids is not None:
        db_anime.themes = []
        for theme_id in anime.theme_ids:
            theme = db.query(models.Theme).filter(models.Theme.id == theme_id).first()
            if theme:
                db_anime.themes.append(theme)
    
    if anime.demographic_ids is not None:
        db_anime.demographics = []
        for demographic_id in anime.demographic_ids:
            demographic = db.query(models.Demographic).filter(models.Demographic.id == demographic_id).first()
            if demographic:
                db_anime.demographics.append(demographic)
    
    if anime.producer_ids is not None:
        db_anime.producers = []
        for producer_id in anime.producer_ids:
            producer = db.query(models.Producer).filter(models.Producer.id == producer_id).first()
            if producer:
                db_anime.producers.append(producer)
    
    if anime.licensor_ids is not None:
        db_anime.licensors = []
        for licensor_id in anime.licensor_ids:
            licensor = db.query(models.Licensor).filter(models.Licensor.id == licensor_id).first()
            if licensor:
                db_anime.licensors.append(licensor)
    
    if anime.studio_ids is not None:
        db_anime.studios = []
        for studio_id in anime.studio_ids:
            studio = db.query(models.Studio).filter(models.Studio.id == studio_id).first()
            if studio:
                db_anime.studios.append(studio)
    
    # Update the updated_at timestamp
    db_anime.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_anime)
    return db_anime


def delete_anime(db: Session, anime_id: int):
    db_anime = db.query(models.Anime).filter(models.Anime.mal_id == anime_id).first()
    
    if not db_anime:
        return False
    
    db.delete(db_anime)
    db.commit()
    return True


# Function to get statistics about animes
def get_anime_stats(db: Session):
    stats = {}
    
    # Total animes
    stats["total_animes"] = db.query(func.count(models.Anime.mal_id)).scalar()
    
    # Count by type
    type_counts = db.query(
        models.Anime.type, 
        func.count(models.Anime.mal_id)
    ).group_by(models.Anime.type).all()
    stats["types"] = {t[0] if t[0] else "Unknown": t[1] for t in type_counts}
    
    # Count by status
    status_counts = db.query(
        models.Anime.status, 
        func.count(models.Anime.mal_id)
    ).group_by(models.Anime.status).all()
    stats["statuses"] = {s[0] if s[0] else "Unknown": s[1] for s in status_counts}
    
    # Count by season
    season_counts = db.query(
        models.Anime.season, 
        func.count(models.Anime.mal_id)
    ).group_by(models.Anime.season).all()
    stats["seasons"] = {s[0] if s[0] else "Unknown": s[1] for s in season_counts}
    
    # Count by year
    year_counts = db.query(
        models.Anime.year, 
        func.count(models.Anime.mal_id)
    ).group_by(models.Anime.year).all()
    stats["years"] = {int(y[0]) if y[0] else "Unknown": y[1] for y in year_counts}
    
    # Top genres
    genre_counts = db.query(
        models.Genre.name,
        func.count(models.anime_genres.c.anime_id)
    ).join(models.anime_genres).group_by(models.Genre.name).order_by(
        func.count(models.anime_genres.c.anime_id).desc()
    ).limit(10).all()
    stats["top_genres"] = {g[0]: g[1] for g in genre_counts}
    
    # Average score
    stats["average_score"] = db.query(func.avg(models.Anime.score)).scalar()
    
    return stats
def update_user_anime_counters(db: Session, user_id: int):
    # Lấy tất cả đánh giá của người dùng
    user_ratings = db.query(models.Rating).filter(models.Rating.user_id == user_id).all()
    
    # Khởi tạo các bộ đếm
    watching_count = 0
    completed_count = 0
    onhold_count = 0
    dropped_count = 0
    plantowatch_count = 0
    
    # Đếm đánh giá theo trạng thái
    for rating in user_ratings:
        if rating.my_status == 1:
            watching_count += 1
        elif rating.my_status == 2:
            completed_count += 1
        elif rating.my_status == 3:
            onhold_count += 1
        elif rating.my_status == 4:
            dropped_count += 1
        elif rating.my_status == 5:
            plantowatch_count += 1
    
    # Cập nhật bộ đếm của người dùng
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if user:
        user.user_watching = watching_count
        user.user_completed = completed_count
        user.user_onhold = onhold_count
        user.user_dropped = dropped_count
        user.user_plantowatch = plantowatch_count
        user.total_anime = len(user_ratings)
        # Tổng số lượng anime khác nhau mà người dùng đã vote
        user.total_anime = len(user_ratings)
        # Tính điểm trung bình (chỉ cho anime đã hoàn thành)
        completed_ratings = [r.my_score for r in user_ratings if r.my_score>0]
        if completed_ratings:
            user.mean_score = round(float(sum(completed_ratings)) / len(completed_ratings), 2)
        else:
            user.mean_score = 0.0    
        db.commit()
        return user
    
    return None