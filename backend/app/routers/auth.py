from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import database, schemas, models, utils, oauth2

router = APIRouter(tags=['Authentication'])

@router.post('/login', response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    try:
        user = db.query(models.User).filter(
            models.User.username == user_credentials.username).first()
        
        if not user:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"username failed")
        
        if not utils.verify(user_credentials.password, user.password):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"pass failed")
        
        access_token = oauth2.create_access_token(data = {"user_id": user.user_id})
        return {"access_token": access_token, "token_type":"bearer"}
    except Exception as e:
        print(f"Lỗi: {e}")
        raise
