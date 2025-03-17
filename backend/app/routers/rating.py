from fastapi import Body, FastAPI,Response,status,HTTPException,Depends,APIRouter
from .. import schemas,models,utils,database,oauth2
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
router=APIRouter(
    prefix="/rating",
    tags=["Rating"]
)


@router.get("/",response_model=List[schemas.Rating])
def get_all_rating(db:Session=Depends(database.get_db),skip:int=0,limit:int=10,current_user:models.User=Depends(oauth2.get_current_user)):
    ratings=db.query(models.Rating).filter(models.Rating.user_id==current_user.user_id).offset(skip).limit(limit).all()
    return ratings

@router.post("/",status_code=status.HTTP_201_CREATED)
def create_rating(rating:schemas.Rating,db:Session=Depends(database.get_db),current_user:models.User=Depends(oauth2.get_current_user)):
    anime=db.query(models.Anime).filter(models.Anime.mal_id==rating.mal_id).first()
    if not anime:
        raise HTTPException(status_code=404,detail="Post not found")
    rating_query = db.query(models.Rating).filter(models.Rating.mal_id == rating.mal_id, 
                                               current_user.user_id == models.Rating.user_id,
                                               )
    found_rating=rating_query.first()
    if found_rating:    
        raise HTTPException(status_code=400, detail="Rating already exists with these values")
    else:
        new_rating=models.Rating(mal_id=rating.mal_id,user_id=current_user.user_id,my_score=rating.my_score,my_status=rating.my_status)
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)
        return {"message":"Vote created"}
    


@router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rating(id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    rating_query = db.query(models.Rating).filter(models.Rating.rating_id == id)
    found_rating = rating_query.first()
    if not found_rating:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found")
    if found_rating.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    rating_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT,detail="Rating deleted successfully")



@router.put("/update/{id}", status_code=status.HTTP_200_OK)
def update_rating(id: int, rating: schemas.Rating, db: Session = Depends(database.get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    rating_query = db.query(models.Rating).filter(models.Rating.rating_id == id)
    found_rating = rating_query.first()
    if not found_rating:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found")
    if found_rating.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform requested action")
    anime = db.query(models.Anime).filter(models.Anime.mal_id == rating.mal_id).first()
    if not anime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anime not found")
    if found_rating.my_score == rating.my_score and found_rating.my_status == rating.my_status:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rating already exists with these values")
    found_rating.my_score = rating.my_score
    found_rating.my_status = rating.my_status
    found_rating.create_at = datetime.now()
    db.commit()   
    return {"message": "Rating updated successfully"}
