from typing import Dict, List, Optional, Tuple
import json
import google.generativeai as genai
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from .models import Anime
# Assume you have these imports from your existing code
# from models import Anime, Genre, Theme, etc.
from .database import get_db
from .config import settings
from .crud import get_anime
# Configure Google Gemini API
def get_gemini_client(api_key: str):
    """Create and return a Gemini client with your API key"""
    return genai.configure(api_key=settings.api_key_gemini)


def generate_comparison_content(anime1_details: Anime, anime2_details: Anime, client: str = "") -> str:
    """Generate comparison content using Gemini LLM"""
    # Create prompt for Gemini
    prompt = f"""
    Compare the following two anime and identify their common features:
    
    Anime 1: {anime1_details.title}
    - Genres: {anime1_details.genres}
    - Themes: {anime1_details.themes}
    - Type: {anime1_details.type}
    - Source: {anime1_details.source}
    - Year: {anime1_details.year}
    - Rating: {anime1_details.rating}
    - Synopsis: {anime1_details.synopsis}
    
    Anime 2: {anime2_details.title}
    - Genres: {anime2_details.genres}
    - Themes: {anime2_details.themes}
    - Type: {anime2_details.type}
    - Source: {anime2_details.source}
    - Year: {anime2_details.year}
    - Rating: {anime2_details.rating}
    - Synopsis: {anime2_details.synopsis}
    
    Please write a concise paragraph (3-5 sentences) highlighting the common features, themes, or style elements shared by these two anime. 
    Focus on their similarities in terms of story elements, artistic style, tone, or thematic content.
    If they have few similarities, focus on any subtle connections that might appeal to fans of both series.
    Make your comparison insightful and helpful for anime fans who might enjoy both shows.Always respond in Vietnamese
    Return ONLY the comparison paragraph with no additional text.
    """
    
    # Generate content with Gemini

    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)

    
    # Extract and return the content
    content = response.text.strip()
    return content

def compare_anime(anime_id1: int, anime_id2: int, db: Session = Depends(get_db), api_key: str = ""):
    """
    Main function to compare two anime by their IDs
    
    Args:
        anime_id1: MAL ID of the first anime
        anime_id2: MAL ID of the second anime
        db: Database session
        api_key: Google Gemini API key
    
    Returns:
        Dict containing comparison data
    """
    # Configure Gemini client
    client = get_gemini_client(api_key)
    
    # Get details for both anime
    anime1_details = get_anime(db, anime_id1)
    anime2_details = get_anime(db, anime_id2)
    
    # Generate comparison content
    content = generate_comparison_content(anime1_details, anime2_details, client)
    # Create response object
    response = {
        "mal_id": f"{anime_id1}-{anime_id2}",
        "entry": [
            {
                "mal_id": anime_id1,
                "url": anime1_details.url,
                "images": {
                    "jpg": {
                        "image_url": anime1_details.image_url,
                        "small_image_url": anime1_details.small_image_url,
                        "large_image_url": anime1_details.large_image_url
                    }
                },
                "title": anime1_details.title
            },
            {
                "mal_id": anime_id2,
                "url": anime2_details.url,
                "images": {
                    "jpg": {
                        "image_url": anime2_details.image_url,
                        "small_image_url": anime2_details.small_image_url,
                        "large_image_url": anime2_details.large_image_url
                    }
                },
                "title": anime2_details.title
            }
        ],
        "content": content
    }
    
    return response

