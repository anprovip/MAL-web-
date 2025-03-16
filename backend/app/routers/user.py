from fastapi import FastAPI, HTTPException, Response, status, Depends, APIRouter
from sqlalchemy.orm import Session
from ..database import engine, get_db
from .. import models, schemas, utils,oauth2
router = APIRouter(prefix="/users", tags=['Users'])

@router.post("/", status_code = status.HTTP_201_CREATED, response_model= schemas.UserOut )
def create_user(user: schemas.UserCreate ,db: Session = Depends(get_db)):

    #hash the password
    hashed_password = utils.hash(user.password)
    user.password = hashed_password


    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
@router.get("/", response_model=schemas.UserOut)
def get_user(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    user =  db.query(models.User).filter(models.User.user_id == current_user.user_id).first()

    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail=f"User with does not exist")
    
    return user
