from fastapi import APIRouter, HTTPException, Response, status, Depends, Path, Query
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas, crud
from typing import Optional, List
import math

router = APIRouter(prefix="/animes", tags=['Animes'])

# ----- Anime Endpoints -----
@router.get("/", response_model=schemas.PaginatedResponse)
def get_animes(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Items per page"),
    title: Optional[str] = Query(None, description="Search by title"),
    genres: Optional[List[str]] = Query(None, description="Filter by genres"),
    type: Optional[str] = Query(None, description="Filter by type (TV, Movie, OVA, etc.)"),
    status: Optional[str] = Query(None, description="Filter by status (Finished Airing, Currently Airing, etc.)"),
    season: Optional[str] = Query(None, description="Filter by season (Winter, Spring, Summer, Fall)"),
    year: Optional[int] = Query(None, description="Filter by year"),
    min_score: Optional[float] = Query(None, ge=0, le=10, description="Minimum score"),
    sort_by: str = Query("popularity", description="Sort by (popularity, score, rank, year, title)")
):
    # Calculate skip for DB query
    skip = (page - 1) * size
    
    # Get animes and total count using CRUD function
    animes, total = crud.get_animes(
        db=db, 
        skip=skip, 
        limit=size,
        title=title,
        genres=genres,
        type=type,
        status=status,
        season=season,
        year=year,
        min_score=min_score,
        sort_by=sort_by
    )
    
    # Calculate total pages
    pages = math.ceil(total / size) if total > 0 else 0
    
    # Return paginated response
    return {
        "data": animes,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }


@router.get("/{anime_id}", response_model=schemas.AnimeResponse)
def get_anime(anime_id: int = Path(..., description="MAL ID of the anime to get"), 
              db: Session = Depends(get_db)):
    db_anime = crud.get_anime(db, anime_id=anime_id)
    
    if not db_anime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f"Anime with id: {anime_id} was not found")
    return {"data": db_anime}


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.AnimeResponse)
def create_anime(anime: schemas.AnimeCreate, db: Session = Depends(get_db)):
    # Check if anime with same mal_id already exists
    if anime.mal_id:
        db_anime = crud.get_anime(db, anime_id=anime.mal_id)
        if db_anime:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                              detail="Anime with this mal_id already exists")
    
    # Check if anime with same title already exists
    db_anime_title = crud.get_anime_by_title(db, title=anime.title)
    if db_anime_title:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                          detail="Anime with this title already exists")
    
    return crud.create_anime(db=db, anime=anime)


@router.put("/{anime_id}", response_model=schemas.AnimeResponse)
def update_anime(
    anime_id: int = Path(..., description="MAL ID of the anime to update"),
    anime: schemas.AnimeUpdate = ...,
    db: Session = Depends(get_db)
):
    # Update anime using CRUD function
    db_anime = crud.update_anime(db, anime_id=anime_id, anime=anime)
    
    if not db_anime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                          detail=f"Anime with id: {anime_id} does not exist")
    
    return {"data": db_anime}


@router.delete("/{anime_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_anime(anime_id: int = Path(..., description="MAL ID of the anime to delete"), 
                db: Session = Depends(get_db)):
    # Try to delete anime using CRUD function
    success = crud.delete_anime(db, anime_id=anime_id)
    
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                          detail=f"Anime with id: {anime_id} does not exist")
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ----- Stats Endpoint -----
@router.get("/stats/", tags=["Stats"])
def get_stats(db: Session = Depends(get_db)):
    return crud.get_anime_stats(db)