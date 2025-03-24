from pydantic import BaseModel, EmailStr, conint, Field
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: EmailStr
    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str
    class Config:
        from_attributes = True


class UserOut(UserBase):
    user_id: int
    user_watching: int
    user_completed: int
    user_onhold: int
    user_dropped: int
    user_plantowatch:int
    total_anime: int
    total_anime_rated: int
    mean_score: float
    class Config:
        from_attributes = True

class AnimeBase(BaseModel):
    anime_name: str

class AnimeCreate(AnimeBase):
    pass

class  AnimeUpdate(AnimeBase):
    pass

class Anime(AnimeBase):
    anime_id: int
    user_id: int

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None


# Schema cho Genre
class GenreBase(BaseModel):
    name: str


class GenreCreate(GenreBase):
    pass


class GenreResponse(GenreBase):
    id: int

    class Config:
        from_attributes = True


# Schema cho Theme
class ThemeBase(BaseModel):
    name: str


class ThemeCreate(ThemeBase):
    pass


class ThemeResponse(ThemeBase):
    id: int

    class Config:
        from_attributes = True


# Schema cho Demographic
class DemographicBase(BaseModel):
    name: str


class DemographicCreate(DemographicBase):
    pass


class DemographicResponse(DemographicBase):
    id: int

    class Config:
        from_attributes = True


# Schema cho Producer
class ProducerBase(BaseModel):
    name: str


class ProducerCreate(ProducerBase):
    pass


class ProducerResponse(ProducerBase):
    id: int

    class Config:
        from_attributes = True


# Schema cho Licensor
class LicensorBase(BaseModel):
    name: str


class LicensorCreate(LicensorBase):
    pass


class LicensorResponse(LicensorBase):
    id: int

    class Config:
        from_attributes = True


# Schema cho Studio
class StudioBase(BaseModel):
    name: str


class StudioCreate(StudioBase):
    pass


class StudioResponse(StudioBase):
    id: int

    class Config:
        from_attributes = True

class MalStatsResponse(BaseModel):
    score: float
    scored_by: int
    rank: int
    members: int
    popularity: int
    class Config:
        from_attributes = True

# Schema cho Anime
class AnimeBase(BaseModel):
    title: str
    title_english: Optional[str] = None
    title_japanese: Optional[str] = None
    type: Optional[str] = None
    source: Optional[str] = None
    episodes: Optional[float] = None
    status: Optional[str] = None
    airing: Optional[bool] = None
    duration: Optional[str] = None
    rating: Optional[str] = None
    popularity: Optional[int] = None
    favorites: Optional[int] = None
    
    season: Optional[str] = None
    year: Optional[float] = None
    
    approved: Optional[bool] = None
    background: Optional[str] = None
    
    image_url: Optional[str] = None
    small_image_url: Optional[str] = None
    large_image_url: Optional[str] = None
    webp_image_url: Optional[str] = None
    webp_small_image_url: Optional[str] = None
    webp_large_image_url: Optional[str] = None
    
    trailer_youtube_id: Optional[str] = None
    trailer_url: Optional[str] = None
    trailer_embed_url: Optional[str] = None
    
    title_synonyms: Optional[str] = None
    title_spanish: Optional[str] = None
    title_german: Optional[str] = None
    title_default: Optional[str] = None
    title_french: Optional[str] = None
    
    aired_from: Optional[datetime] = None
    aired_to: Optional[datetime] = None
    aired_string: Optional[str] = None
    aired_from_day: Optional[int] = None
    aired_from_month: Optional[int] = None
    aired_from_year: Optional[int] = None
    aired_to_day: Optional[float] = None
    aired_to_month: Optional[float] = None
    aired_to_year: Optional[float] = None
    broadcast_day: Optional[str] = None
    broadcast_time: Optional[str] = None
    broadcast_timezone: Optional[str] = None
    broadcast_string: Optional[str] = None
    
    synopsis: Optional[str] = None


class AnimeCreate(AnimeBase):
    mal_id: Optional[int] = None
    url: Optional[str] = None
    # IDs for relationships
    genre_ids: Optional[List[int]] = []
    theme_ids: Optional[List[int]] = []
    demographic_ids: Optional[List[int]] = []
    producer_ids: Optional[List[int]] = []
    licensor_ids: Optional[List[int]] = []
    studio_ids: Optional[List[int]] = []


class AnimeUpdate(AnimeBase):
    title: Optional[str] = None
    # IDs for relationships
    genre_ids: Optional[List[int]] = []
    theme_ids: Optional[List[int]] = []
    demographic_ids: Optional[List[int]] = []
    producer_ids: Optional[List[int]] = []
    licensor_ids: Optional[List[int]] = []
    studio_ids: Optional[List[int]] = []


class AnimeResponse(AnimeBase):
    mal_id: int
    url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    genres: List[GenreResponse] = []
    themes: List[ThemeResponse] = []
    demographics: List[DemographicResponse] = []
    producers: List[ProducerResponse] = []
    licensors: List[LicensorResponse] = []
    studios: List[StudioResponse] = []
    mal_stats: Optional[MalStatsResponse] = None
    
    class Config:
        from_attributes = True


# Schemas cho pagination
class PaginatedResponse(BaseModel):
    items: List[AnimeResponse]
    total: int
    page: int
    size: int
    pages: int

class Rating(BaseModel):
    anime_id: int
    my_status:int
    my_score: int = 0
    class Config:
        from_attributes = True

class RatingOut(Rating):
    user_id: int
    rating_id: int
    create_at: datetime
    class Config:
        from_attributes = True

class RatingDelete(BaseModel):
    anime_id: int
    class Config:
        from_attributes = True


class SimilarityScore(BaseModel):
    """Thông tin về điểm tương đồng giữa anime gốc và anime được đề xuất"""
    score: float = Field(..., description="Điểm tương đồng dạng số thập phân (0-1)")
    percentage: str = Field(..., description="Điểm tương đồng dạng phần trăm (đã được định dạng, ví dụ: '85.42%')")

class SimilarAnimeItem(AnimeResponse):
    """Mở rộng từ AnimeResponse, thêm thông tin về điểm tương đồng"""
    similarity: SimilarityScore
    
    class Config:
        from_attributes = True

class RatingUpdate(BaseModel):
    pass
    class Config:
        from_attributes = True

class UserStats(BaseModel):
    user_id: int
    class Config:
        from_attributes = True
class UserStatsOut(BaseModel):
    user_stats_id: int
    user_id: int
    total_anime: int
    total_anime_rated: int
    mean_score: float
    class Config:
        from_attributes = True


class SimilarAnimeResponse(BaseModel):
    """Response trả về danh sách anime tương tự"""
    source_anime: AnimeResponse  # Anime gốc dùng để tìm kiếm
    similar_anime: List[SimilarAnimeItem]  # Danh sách anime tương tự
    count: int  # Số lượng anime tương tự được trả về