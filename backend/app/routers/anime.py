from fastapi import FastAPI, HTTPException, Response, status, Depends, APIRouter
from sqlalchemy.orm import Session
from ..database import engine, get_db
from .. import models, schemas, oauth2
from typing import Optional, List


router = APIRouter(prefix="/animes", tags=['Animes'])

@router.get("/", response_model=List[schemas.Anime])
def get_posts(db: Session = Depends(get_db), limit: int =10, skip: int = 0,
              get_current_user: str = Depends(oauth2.get_current_user)):
    # cursor.execute("""SELECT * FROM posts""")
    # posts = cursor.fetchall()

    posts = db.query(models.Anime).limit(limit).offset(skip).all()
    return posts

@router.get("/{id}", response_model=schemas.Anime)
def get_post(id: int, db: Session = Depends(get_db),
             get_current_user: str = Depends(oauth2.get_current_user)):
    # cursor.execute("""SELECT * from posts WHERE id = %s""", (str(id)))
    # post = cursor.fetchone()

    anime = db.query(models.Anime).filter(models.Anime.anime_id == id).first()
    print(anime)

    if not anime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"post with id: {id} was mot found")
    return anime

@router.post("/",status_code = status.HTTP_201_CREATED, response_model=schemas.Anime)
def create_posts(anime: schemas.AnimeCreate, db: Session = Depends(get_db), 
                 get_current_user: str = Depends(oauth2.get_current_user)):
    # cursor.execute("""INSERT INTO posts (title, content, published) VALUES (%s, %s, %s) RETURNING * """,
    #                 (post.title, post.content, post.published))
    # new_post = cursor.fetchone()
    # conn.commit()
    new_anime = models.Anime(user_id = get_current_user.user_id, **anime.dict())
    db.add(new_anime)
    db.commit()
    db.refresh(new_anime)
    return new_anime

# @router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_posts(id: int, db: Session = Depends(get_db),
#                  current_user: str = Depends(oauth2.get_current_user)):
#     # cursor.execute("""DELETE FROM posts WHERE id = %s returning*""", (str(id)))
#     # delete_posts = cursor.fetchone()
#     # conn.commit()
#     post = db.query(models.Post).filter(models.Post.id == id)
#     if post.first() == None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
#                             detail= f"post with id: {id} doesn't exist")
#     if post.first().owner_id != current_user.id:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    

#     post.delete(synchronize_session=False)
#     post.commit()

#     return Response(status_code=status.HTTP_204_NO_CONTENT)

# @router.put("/{id}", response_model=schemas.Post)
# def update_post(id: int, updated_post: schemas.PostUpdate, db: Session = Depends(get_db),
#                 current_user: str = Depends(oauth2.get_current_user)):
#     post_query = db.query(models.Post).filter(models.Post.id == id)
 
#     post = post_query.first()

#     if post == None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
#                             detail= f"post with id: {id} doesn't exist")
    
#     if post_query.first().owner_id != current_user.id:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")

#     post_query.update(updated_post.dict(), synchronize_session=False)
#     db.commit()
#     return post_query.first()