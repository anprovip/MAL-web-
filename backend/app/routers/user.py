from fastapi import FastAPI, HTTPException, Response, status, Depends, APIRouter
from sqlalchemy.orm import Session

from .. import crud
from ..database import engine, get_db
from .. import models, schemas, utils,oauth2
router = APIRouter(prefix="/users", tags=['Users'])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    try:
        # Hash the password
        hashed_password = utils.hash(user.password)
        user.password = hashed_password

        new_user = models.User(**user.dict())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Kiểm tra các trường cần thiết
        if not hasattr(new_user, "total_anime"):
            new_user.total_anime = 0
        if not hasattr(new_user, "total_anime_rated"):
            new_user.total_anime_rated = 0
        if not hasattr(new_user, "mean_score"):
            new_user.mean_score = 0.0

        return new_user

    except Exception as e:
        db.rollback()  # Đảm bảo không có thay đổi nào được lưu khi xảy ra lỗi
        raise HTTPException(status_code=500, detail=f"Lỗi tạo user: {str(e)}")

@router.get("/", response_model=schemas.UserOut)
def get_user(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    user = crud.get_user(db, user_id=current_user.user_id)
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail=f"User with does not exist")
    
    return user
