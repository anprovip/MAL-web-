import numpy as np
from sqlalchemy.orm import Session
from . import models, schemas, crud
from sklearn.preprocessing import LabelEncoder
from typing import List, Dict, Any
from .schemas import SimilarAnimeResponse, SimilarAnimeItem, SimilarityScore
# Load the model
anime_weights = np.load('model_ai/anime_weights.npy')
user_weights = np.load('model_ai/user_weights.npy')

anime_encoder = LabelEncoder()
anime_encoder.classes_ = np.load('model_ai/anime_encoder_classes.npy')

user_encder = LabelEncoder()
user_encder.classes_ = np.load('model_ai/user_encoder_classes.npy')


def find_similar_animes(
    db: Session,
    mal_id: int,
    n: int = 10,
    return_dist: bool = False,
    neg: bool = False
) -> SimilarAnimeResponse:
    """
    Tìm những anime tương tự với anime có ID được cung cấp.
    
    Args:
        mal_id: ID của anime cần tìm anime tương tự
        n: Số lượng anime tương tự muốn trả về
        return_dist: Có trả về ma trận khoảng cách và chỉ số không
        neg: Nếu True sẽ trả về anime ít tương tự nhất, ngược lại trả về anime tương tự nhất
    
    Returns:
        SimilarAnimeResponse: Đối tượng chứa anime gốc và danh sách anime tương tự
    """
    
    # Lấy thông tin anime từ database
    source_anime = crud.get_anime(db, mal_id)

    if not source_anime:
        print(f'Anime with ID {mal_id} not found in Anime list')
        return None
    
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
        similar_anime_items = []
        for idx in closest:
            decoded_id = int(anime_encoder.inverse_transform([idx])[0])
            
            # Bỏ qua nếu ID trùng với anime gốc
            if decoded_id == mal_id:
                continue
                
            # Lấy thông tin anime từ database
            anime_info = crud.get_anime(db, decoded_id)
            if anime_info:
                # Tính điểm tương đồng
                similarity_value = float(dists[idx])
                similarity_percent = f"{similarity_value * 100:.2f}%"
                
                # Tạo đối tượng SimilarityScore
                similarity = schemas.SimilarityScore(
                    score=similarity_value,
                    percentage=similarity_percent
                )
                
                # Đầu tiên chuyển đổi anime_info thành AnimeResponse
                anime_response = schemas.AnimeResponse.model_validate(anime_info)
                
                # Sau đó tạo SimilarAnimeItem bằng cách kết hợp dữ liệu
                # từ anime_response và thêm trường similarity
                similar_item = SimilarAnimeItem(
                    **anime_response.model_dump(),  # Sử dụng tất cả các trường từ AnimeResponse
                    similarity=similarity  # Thêm trường similarity
                )
                
                similar_anime_items.append(similar_item)

        # Tạo source_anime_response từ source_anime
        source_anime_response = schemas.AnimeResponse.model_validate(source_anime)

        # Tạo đối tượng response
        response = SimilarAnimeResponse(
            source_anime=source_anime_response,
            similar_anime=similar_anime_items,
            count=len(similar_anime_items)
        )

        return response
        
        
    except Exception as e:
        print(f"Error in find_similar_animes: {str(e)}")
        return SimilarAnimeResponse(
            source_anime=source_anime,
            similar_anime=[],
            count=0
        )