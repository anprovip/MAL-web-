from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int 
    email: EmailStr
    
    class Config:
        orm_mode = True

class PostBase(BaseModel):
    title: str
    content: str
    published: bool = True

class PostCreate(PostBase):
    pass

class PostUpdate(PostBase):
    pass

class Post(PostBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None

# Schema cho Genre
class GenreBase(BaseModel):
    name: str


class GenreCreate(GenreBase):
    pass


class GenreResponse(GenreBase):
    id: int

    class Config:
        orm_mode = True


# Schema cho Theme
class ThemeBase(BaseModel):
    name: str


class ThemeCreate(ThemeBase):
    pass


class ThemeResponse(ThemeBase):
    id: int

    class Config:
        orm_mode = True


# Schema cho Demographic
class DemographicBase(BaseModel):
    name: str


class DemographicCreate(DemographicBase):
    pass


class DemographicResponse(DemographicBase):
    id: int

    class Config:
        orm_mode = True


# Schema cho Producer
class ProducerBase(BaseModel):
    name: str


class ProducerCreate(ProducerBase):
    pass


class ProducerResponse(ProducerBase):
    id: int

    class Config:
        orm_mode = True


# Schema cho Licensor
class LicensorBase(BaseModel):
    name: str


class LicensorCreate(LicensorBase):
    pass


class LicensorResponse(LicensorBase):
    id: int

    class Config:
        orm_mode = True


# Schema cho Studio
class StudioBase(BaseModel):
    name: str


class StudioCreate(StudioBase):
    pass


class StudioResponse(StudioBase):
    id: int

    class Config:
        orm_mode = True


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
    
    score: Optional[float] = None
    scored_by: Optional[float] = None
    rank: Optional[int] = None
    popularity: Optional[int] = None
    members: Optional[int] = None
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

    class Config:
        orm_mode = True


# Schemas cho pagination
class PaginatedResponse(BaseModel):
    items: List[AnimeResponse]
    total: int
    page: int
    size: int
    pages: int