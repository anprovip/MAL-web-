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
def delete_rating(
    rating: schemas.RatingDelete,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    # Ép kiểu user_id để đảm bảo chính xác khi so sánh
    current_user_id = int(current_user.user_id)

    # Tìm rating với điều kiện anime_id và user_id
    rating_query = db.query(models.Rating).filter(
        models.Rating.anime_id == rating.anime_id,
        models.Rating.user_id == current_user_id  # Chỉ lấy rating của chính user
    )

    found_rating = rating_query.first()

    # Nếu không tìm thấy rating phù hợp, nghĩa là user không có quyền hoặc không tồn tại rating
    if not found_rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Rating not found for anime_id: {rating.anime_id} with user_id: {current_user_id}"
            ),
        )

    # Xóa rating
    rating_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)




@router.put("/update/", status_code=status.HTTP_200_OK)
def update_rating(
    rating: schemas.Rating,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    # Ép kiểu user_id để đảm bảo chính xác khi so sánh
    current_user_id = int(current_user.user_id)

    # Kiểm tra xem user có rating nào không trước khi kiểm tra anime_id
    rating_query = db.query(models.Rating).filter(
        models.Rating.user_id == current_user_id,
        models.Rating.anime_id == rating.anime_id
    )

    found_rating = rating_query.first()

    # Nếu không tìm thấy rating phù hợp, nghĩa là user chưa đánh giá anime này
    if not found_rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rating not found for anime_id: {rating.anime_id} with user_id: {current_user_id}",
        )

    # Kiểm tra xem anime có tồn tại không trước khi cập nhật rating
    anime = db.query(models.Anime).filter(models.Anime.mal_id == rating.anime_id).first()
    if not anime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anime not found")

    # Kiểm tra xem người dùng có thực sự thay đổi dữ liệu không
    if found_rating.my_score == rating.my_score and found_rating.my_status == rating.my_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating already exists with these values",
        )

    # Cập nhật rating
    found_rating.my_score = rating.my_score
    found_rating.my_status = rating.my_status
    found_rating.created_at = datetime.now()  # Đảm bảo đúng trường created_at
    db.commit()

    # Gọi hàm cập nhật dữ liệu nếu cần (bỏ comment nếu đã có hàm này)
    # crud.update_user_anime_counters(db, current_user_id)

    return {"message": "Rating updated successfully"}

