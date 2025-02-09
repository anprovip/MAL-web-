import pandas as pd
import numpy as np
from pathlib import Path

def process_anime_data(input_file: str, output_file: str):
    """
    Đọc file UserAnimeList.csv, lọc các features cần thiết và lưu ra file mới
    
    Args:
        input_file: Đường dẫn đến file input CSV
        output_file: Đường dẫn để lưu file output CSV
    """
    try:
        # Đọc file CSV
        print(f"Đang đọc file từ {input_file}...")
        df = pd.read_csv(input_file)
        
        # Chọn các cột cần thiết
        columns_to_keep = [
            'username',
            'anime_id', 
            'my_score',
            'my_status'
        ]
        
        # Lọc các cột
        df_processed = df[columns_to_keep].copy()
        
        # Lọc bỏ các dòng có giá trị null
        df_processed = df_processed.dropna()
        
        # Lọc các record có score = 0 (chưa rate)
        df_processed = df_processed[df_processed['my_score'] > 0]
        
        # Chỉ giữ lại các status hợp lệ (1: watching, 2: completed, 3: on hold, 4: dropped)
        valid_statuses = [1, 2, 3, 4]
        df_processed = df_processed[df_processed['my_status'].isin(valid_statuses)]
        
        # Tạo thư mục output nếu chưa tồn tại
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Lưu file
        print(f"Đang lưu file đã xử lý vào {output_file}...")
        df_processed.to_csv(output_file, index=False)
        
        # In thông tin về dataset
        print("\nThông tin về dataset sau khi xử lý:")
        print(f"Số lượng records: {len(df_processed):,}")
        print(f"Số lượng users unique: {df_processed['username'].nunique():,}")
        print(f"Số lượng anime unique: {df_processed['anime_id'].nunique():,}")
        print("\nPhân bố của status:")
        status_counts = df_processed['my_status'].value_counts()
        status_mapping = {
            1: "watching",
            2: "completed",
            3: "on hold",
            4: "dropped"
        }
        for status, count in status_counts.items():
            print(f"{status_mapping.get(status, status)}: {count:,}")
        
        print("\nThống kê về scores:")
        print(df_processed['my_score'].describe())
        
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file tại {input_file}")
    except Exception as e:
        print(f"Lỗi khi xử lý file: {str(e)}")

if __name__ == "__main__":
    # Định nghĩa input và output paths
    input_file = r"D:\Data_code\UserAnimeList.csv"  # Sử dụng đường dẫn thực tế
    output_file = r"D:\Data_code\user_anime_processed.csv"  # File output sẽ được lưu cùng thư mục
    
    # Xử lý dữ liệu
    process_anime_data(input_file, output_file)