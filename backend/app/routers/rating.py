from fastapi import Body, FastAPI,Response,status,HTTPException,Depends,APIRouter

from .. import crud
from .. import schemas,models,utils,database,oauth2
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
router=APIRouter(
    prefix="/rating",
    tags=["Rating"]
)


@router.get("/",response_model=List[schemas.RatingOut])
def get_all_rating(db:Session=Depends(database.get_db),skip:int=0,limit:int=100,current_user:models.User=Depends(oauth2.get_current_user)):
    ratings=db.query(models.Rating).filter(models.Rating.user_id==current_user.user_id).offset(skip).limit(limit).all()
    return ratings

@router.post("/",status_code=status.HTTP_201_CREATED)
def create_rating(rating:schemas.Rating, db:Session=Depends(database.get_db), current_user:models.User=Depends(oauth2.get_current_user)):
    anime=db.query(models.Anime).filter(models.Anime.mal_id==rating.anime_id).first()
    if not anime:
        raise HTTPException(status_code=404,detail="Post not found")
    
    rating_query = db.query(models.Rating).filter(models.Rating.anime_id == rating.anime_id, 
                                               models.Rating.user_id == current_user.user_id,
                                               )
    found_rating=rating_query.first()
    if found_rating:    
        raise HTTPException(status_code=400, detail="Rating already exists with these values")
    else:
        new_rating=models.Rating(anime_id=rating.anime_id,user_id=current_user.user_id,my_score=rating.my_score,my_status=rating.my_status)
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)
        return {"message":"Vote created"}
    


@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
def delete_rating(rating :schemas.RatingDelete,db: Session = Depends(database.get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    rating_query = db.query(models.Rating).filter(models.Rating.anime_id == rating.anime_id)
    found_rating = rating_query.first()
    if not found_rating:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found")
    if found_rating.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    rating_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)



@router.put("/update/", status_code=status.HTTP_200_OK)
def update_rating( rating: schemas.Rating, db: Session = Depends(database.get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    rating_query = db.query(models.Rating).filter(models.Rating.anime_id == rating.anime_id)
    found_rating = rating_query.first()
    if not found_rating:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found")
    if found_rating.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    anime = db.query(models.Anime).filter(models.Anime.mal_id == rating.anime_id).first()
    if not anime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anime not found")
    if found_rating.my_score == rating.my_score and found_rating.my_status == rating.my_status:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rating already exists with these values")
    found_rating.my_score = rating.my_score
    found_rating.my_status = rating.my_status
    found_rating.create_at = datetime.now()
    db.commit()  
    # crud.update_user_anime_counters(db, current_user.user_id) 
    return {"message": "Rating updated successfully"}
