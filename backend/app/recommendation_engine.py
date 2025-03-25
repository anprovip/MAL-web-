import numpy as np
from sqlalchemy.orm import Session
from . import models, schemas, crud
from sklearn.preprocessing import LabelEncoder
from typing import List, Dict, Any
from .schemas import SimilarAnimeResponse, SimilarAnimeItem, SimilarityScore
import pandas as pd
from collections import Counter

# Load the model
anime_weights = np.load('model_ai/anime_weights.npy')
user_weights = np.load('model_ai/user_weights.npy')

anime_encoder = LabelEncoder()
anime_encoder.classes_ = np.load('model_ai/anime_encoder_classes.npy')

user_encoder = LabelEncoder()
user_encoder.classes_ = np.load('model_ai/user_encoder_classes.npy')

def find_similar_animes(
    db: Session,
    mal_id: int,
    n: int = 10,
    return_dist: bool = False,
    neg: bool = False
) -> List[schemas.AnimeResponse]:
    """
    Tìm những anime tương tự với anime có ID được cung cấp.
    
    Args:
        mal_id: ID của anime cần tìm anime tương tự
        n: Số lượng anime tương tự muốn trả về
        return_dist: Có trả về ma trận khoảng cách và chỉ số không
        neg: Nếu True sẽ trả về anime ít tương tự nhất, ngược lại trả về anime tương tự nhất
    
    Returns:
        List[schemas.AnimeResponse]: Danh sách các đối tượng AnimeResponse chứa thông tin chi tiết của các anime tương tự
    """
    # Lấy thông tin anime từ database
    source_anime = crud.get_anime(db, mal_id)

    if not source_anime:
        print(f'Anime with ID {mal_id} not found in Anime list')
        return []
    
    # Tính toán độ tương đồng
    try:
        encoded_index = anime_encoder.transform([mal_id])[0]
        dists = np.dot(anime_weights, anime_weights[encoded_index])
        sorted_indices = np.argsort(dists)
        
        # Lấy n+1 vì sau sẽ loại bỏ chính anime đang xét
        n = n + 1
        
        if neg:
            closest = sorted_indices[:n]  # Ít tương tự nhất
        else:
            closest = sorted_indices[-n:]  # Tương tự nhất (lấy từ cuối mảng)
            closest = np.flip(closest)  # Đảo ngược để có thứ tự giảm dần
        
        if return_dist:
            return dists, closest
        
        # Tạo danh sách anime tương tự
        similar_anime_ids = []
        for idx in closest:
            decoded_id = int(anime_encoder.inverse_transform([idx])[0])
            
            # Bỏ qua nếu ID trùng với anime gốc
            if decoded_id == mal_id:
                continue
                
            similar_anime_ids.append(decoded_id)

        if not similar_anime_ids:
            return []
        
        # Lấy thông tin chi tiết của các anime
        similar_animes = []
        for anime_id in similar_anime_ids:
            anime = crud.get_anime(db, anime_id)
            if anime:
                similar_animes.append(anime)
        
        return similar_animes
        
    except Exception as e:
        print(f"Error in find_similar_animes: {str(e)}")
        return []

def find_most_similar_anime_id(
    db: Session,
    mal_id: int
) -> int:
    """
    Tìm ID của anime tương đồng nhất với anime có ID được cung cấp.
    
    Args:
        db: Session database
        mal_id: ID của anime cần tìm anime tương tự
    
    Returns:
        int: ID của anime tương đồng nhất, hoặc None nếu không tìm thấy
    """
    # Lấy thông tin anime từ database
    source_anime = crud.get_anime(db, mal_id)

    if not source_anime:
        print(f'Anime with ID {mal_id} not found in Anime list')
        return None
    
    # Tính toán độ tương đồng
    try:
        # Chuyển đổi mal_id thành encoded index
        encoded_index = anime_encoder.transform([mal_id])[0]
        
        # Tính ma trận độ tương đồng
        dists = np.dot(anime_weights, anime_weights[encoded_index])
        
        # Sắp xếp các indices theo độ tương đồng giảm dần
        sorted_indices = np.argsort(dists)[::-1]
        
        # Bỏ qua index đầu tiên vì đó chính là anime đang xét
        for idx in sorted_indices:
            decoded_id = int(anime_encoder.inverse_transform([idx])[0])
            
            # Bỏ qua nếu ID trùng với anime gốc
            if decoded_id == mal_id:
                continue
            
            # Nếu anime tồn tại trong database, trả về ID
            anime_info = crud.get_anime(db, decoded_id)
            if anime_info:
                return decoded_id
                
        # Nếu không tìm thấy anime tương đồng
        return None
        
    except Exception as e:
        print(f"Error in find_most_similar_anime_id: {str(e)}")
        return None
    
def find_similar_users(
    db: Session,
    user_id: int,
    n: int = 10,
    neg: bool = False
) -> list:
    """
    Tìm những người dùng tương tự với người dùng có ID được cung cấp.
    
    Args:
        db: Session database
        user_id: ID của người dùng cần tìm người dùng tương tự
        n: Số lượng người dùng tương tự muốn trả về
        neg: Nếu True sẽ trả về người dùng ít tương tự nhất, ngược lại trả về người dùng tương tự nhất
    
    Returns:
        list: Danh sách ID của những người dùng tương tự
    """
    # Lấy thông tin người dùng từ database
    source_user = crud.get_user(db, user_id)

    if not source_user:
        print(f'User with ID {user_id} not found in User list')
        return []
    
    # Tính toán độ tương đồng
    try:
        encoded_index = user_encoder.transform([user_id])[0]
        dists = np.dot(user_weights, user_weights[encoded_index])
        sorted_indices = np.argsort(dists)
        
        # Lấy n+1 vì sau sẽ loại bỏ chính người dùng đang xét
        n = n + 1
        
        if neg:
            closest = sorted_indices[:n]  # Ít tương tự nhất
        else:
            closest = sorted_indices[-n:]  # Tương tự nhất (lấy từ cuối mảng)
            closest = np.flip(closest)  # Đảo ngược để có thứ tự giảm dần
        
        # Tạo danh sách ID người dùng tương tự
        similar_users = []
        for idx in closest:
            decoded_id = int(user_encoder.inverse_transform([idx])[0])
            
            # Bỏ qua nếu ID trùng với người dùng gốc
            if decoded_id == user_id:
                continue
                
            # Kiểm tra xem người dùng có tồn tại trong database không
            user_exists = crud.get_user(db, decoded_id) is not None
            if user_exists:
                similar_users.append(decoded_id)
            
            # Nếu đã đủ số lượng n người dùng thì dừng
            if len(similar_users) >= n:
                break
        return similar_users 
    except Exception as e:
        print(f"Error in find_similar_users: {str(e)}")
        return []
    


def recommend_animes_for_user(
    db: Session,
    user_id: int,
    n_similar_users: int = 10,
    n_recommendations: int = 10
) -> List[int]:
    """
    Đề xuất anime cho người dùng dựa trên sở thích của những người dùng tương tự.
    
    Args:
        db: Session database
        user_id: ID của người dùng cần đề xuất
        n_similar_users: Số lượng người dùng tương tự để xét
        n_recommendations: Số lượng anime đề xuất
    
    Returns:
        List[int]: Danh sách các anime_id được đề xuất
    """
    # Kiểm tra user tồn tại
    user = crud.get_user(db, user_id)
    if not user:
        return []
    
    # 1. Tìm những người dùng tương tự
    similar_user_ids = find_similar_users(db, user_id, n=n_similar_users)
    
    if not similar_user_ids:
        return []
    
    # 2. Lấy danh sách anime người dùng hiện tại đã đánh giá
    watched_anime_ids = crud.get_user_rated_animes(db, user_id)
    
    if not watched_anime_ids:
        return []
    
    # 3. Thu thập đánh giá từ những người dùng tương tự
    potential_recommendations = {}
    
    for similar_user_id in similar_user_ids:
        # Lấy danh sách đánh giá của người dùng tương tự có điểm >= 7
        similar_user_ratings = crud.get_user_rated_animes(db, similar_user_id, min_score=7)
        
        for anime_id, score in similar_user_ratings:
            # Chỉ xét những anime chưa được người dùng hiện tại xem
            if anime_id not in watched_anime_ids:
                if anime_id in potential_recommendations:
                    potential_recommendations[anime_id]["frequency"] += 1
                    potential_recommendations[anime_id]["score_sum"] += score
                else:
                    potential_recommendations[anime_id] = {
                        "frequency": 1,
                        "score_sum": score
                    }
    
    if not potential_recommendations:
        return []
    
    # 4. Tính điểm đề xuất dựa trên tần suất và điểm trung bình
    for anime_id in potential_recommendations:
        frequency = potential_recommendations[anime_id]["frequency"]
        avg_score = potential_recommendations[anime_id]["score_sum"] / frequency
        # Công thức đề xuất: tần suất * điểm trung bình
        potential_recommendations[anime_id]["recommendation_score"] = frequency * avg_score
    
    # 5. Sắp xếp anime theo điểm đề xuất và lấy n anime đầu tiên
    sorted_recommendations = sorted(
        potential_recommendations.items(), 
        key=lambda x: x[1]["recommendation_score"], 
        reverse=True
    )
    
    # Chỉ trả về danh sách anime_id
    recommended_anime_ids = [anime_id for anime_id, _ in sorted_recommendations[:n_recommendations]]
    
    return recommended_anime_ids