from sqlalchemy import Column, Integer, String, Boolean, ForeignKey,CheckConstraint
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from .database import Base

class Post(Base):
    __tablename__= "posts"

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    content =Column(String, nullable=False)
    published = Column(Boolean, server_default='TRUE', nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    owner_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    
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
class Anime(Base):
    __tablename__="animes"
    anime_id=Column(Integer,primary_key=True,nullable=False)
    anime_name=Column(String,nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
class Rating(Base):
    __tablename__ = "ratings"
    rating_id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    anime_id = Column(Integer, ForeignKey("animes.anime_id", ondelete="CASCADE"), nullable=False)
    my_score = Column(Integer, CheckConstraint("my_score BETWEEN 1 AND 10"), nullable=False)
    my_status = Column(Integer, CheckConstraint("my_status IN (1, 2, 3, 4, 6)"), nullable=False)
    create_at=  Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    
