from fastapi import FastAPI
from . import models
from .database import engine, get_db
from .routers import  user, auth,anime,rating
from .config import settings
from fastapi.middleware.cors import CORSMiddleware
#uvicorn app.main:app --reload 
#venv\Scripts\activate.bat
#docker compose up -d
#python import_data.py
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Chấp nhận tất cả các origin (có thể thay bằng ["http://localhost:3000"] nếu chỉ cho phép React)
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức (GET, POST, PUT, DELETE, ...)
    allow_headers=["*"],  # Cho phép tất cả các headers
)

app.include_router(anime.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(rating.router)
@app.get("/")
async def root():
    return {"message": "Hello World"}






