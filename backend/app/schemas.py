from pydantic import BaseModel, EmailStr, conint
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    class Config:
        orm_mode = True

class UserOut(BaseModel):
    user_id: int 
    email: EmailStr
    username: str
    password:str
    user_watching: int
    user_completed: int
    user_onhold: int
    user_dropped: int
    user_plantowatch:int
    class Config:
        orm_mode = True

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
        orm_mode = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
class Rating(BaseModel):
    anime_id: int
    my_score:int
    my_status:int
    class Config:
        orm_mode = True
class RatingDelete(BaseModel):
    anime_id: int
    class Config:
        orm_mode = True
