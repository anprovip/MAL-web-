"""
Script để nhập dữ liệu từ anime_dataset.csv vào cơ sở dữ liệu PostgreSQL
"""
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, Anime, Genre, Theme, Demographic, Producer, Licensor, Studio

from app.config import settings

# Đường dẫn đến file CSV
CSV_FILE_PATH = 'anime_dataset.csv'

# Kết nối tới PostgreSQL
conn_string = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'
engine = create_engine(conn_string)
Session = sessionmaker(bind=engine)
session = Session()

# Hàm phân tích chuỗi danh sách được phân cách bằng dấu phẩy
def parse_list(list_str):
    if pd.isna(list_str) or list_str == '':
        return []
    return [item.strip() for item in list_str.split(',')]

# Hàm chuyển đổi chuỗi datetime
def parse_datetime(date_str):
    if pd.isna(date_str) or date_str == '':
        return None
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except:
        return None

# Đọc dữ liệu từ tệp CSV
def import_data_from_csv(file_path):
    try:
        print(f"Đang đọc file CSV: {file_path}")
        
        # Đọc dữ liệu từ CSV - thử với nhiều định dạng
        try:
            # Thử đọc file với dấu phẩy làm delimiter
            df = pd.read_csv(file_path)
            print("Đọc file với định dạng CSV thành công")
        except Exception as e:
            print(f"Không thể đọc file với định dạng CSV, thử với tab delimiter: {str(e)}")
            # Thử đọc file với tab làm delimiter
            df = pd.read_csv(file_path, sep='\t')
            print("Đọc file với định dạng TSV thành công")
        
        print(f"Số lượng anime trong file: {len(df)}")
        print(f"Các cột trong file:")
        for col in df.columns:
            print(f"- {col}")
        
        # Xử lý từng anime
        for idx, row in df.iterrows():
            print(f"Đang import anime [{idx+1}/{len(df)}]: {row['title']}")
            
            # Tạo đối tượng Anime
            anime = Anime(
                mal_id=row['mal_id'] if 'mal_id' in row and not pd.isna(row['mal_id']) else None,
                url=row['url'] if 'url' in row and not pd.isna(row['url']) else None,
                title=row['title'] if 'title' in row and not pd.isna(row['title']) else "Unknown Title",
                title_english=row['title_english'] if 'title_english' in row and not pd.isna(row['title_english']) else None,
                title_japanese=row['title_japanese'] if 'title_japanese' in row and not pd.isna(row['title_japanese']) else None,
                type=row['type'] if 'type' in row and not pd.isna(row['type']) else None,
                source=row['source'] if 'source' in row and not pd.isna(row['source']) else None,
                episodes=row['episodes'] if 'episodes' in row and not pd.isna(row['episodes']) else None,
                status=row['status'] if 'status' in row and not pd.isna(row['status']) else None,
                airing=row['airing'] if 'airing' in row and not pd.isna(row['airing']) else None,
                duration=row['duration'] if 'duration' in row and not pd.isna(row['duration']) else None,
                rating=row['rating'] if 'rating' in row and not pd.isna(row['rating']) else None,
                favorites=row['favorites'] if 'favorites' in row and not pd.isna(row['favorites']) else None,
                season=row['season'] if 'season' in row and not pd.isna(row['season']) else None,
                year=row['year'] if 'year' in row and not pd.isna(row['year']) else None,
                approved=row['approved'] if 'approved' in row and not pd.isna(row['approved']) else None,
                background=row['background'] if 'background' in row and not pd.isna(row['background']) else None,
                synopsis=row['synopsis'] if 'synopsis' in row and not pd.isna(row['synopsis']) else None
            )
            
            # Thêm các trường hình ảnh nếu có
            if 'image_url' in row and not pd.isna(row['image_url']):
                anime.image_url = row['image_url']
            if 'small_image_url' in row and not pd.isna(row['small_image_url']):
                anime.small_image_url = row['small_image_url']
            if 'large_image_url' in row and not pd.isna(row['large_image_url']):
                anime.large_image_url = row['large_image_url']
            
            # Thêm thông tin về trailer nếu có
            if 'trailer_youtube_id' in row and not pd.isna(row['trailer_youtube_id']):
                anime.trailer_youtube_id = row['trailer_youtube_id']
            if 'trailer_url' in row and not pd.isna(row['trailer_url']):
                anime.trailer_url = row['trailer_url']
            
            # Thêm thông tin về thời gian phát sóng nếu có
            if 'aired_from' in row and not pd.isna(row['aired_from']):
                anime.aired_from = parse_datetime(row['aired_from'])
            if 'aired_to' in row and not pd.isna(row['aired_to']):
                anime.aired_to = parse_datetime(row['aired_to'])
            
            # Xử lý các mối quan hệ
            
            # Genres
            if 'genres' in row and not pd.isna(row['genres']):
                genre_names = parse_list(row['genres'])
                for genre_name in genre_names:
                    genre = session.query(Genre).filter_by(name=genre_name).first()
                    if not genre:
                        genre = Genre(name=genre_name)
                        session.add(genre)
                        session.flush()
                    anime.genres.append(genre)
            
            # Themes
            if 'themes' in row and not pd.isna(row['themes']):
                theme_names = parse_list(row['themes'])
                for theme_name in theme_names:
                    theme = session.query(Theme).filter_by(name=theme_name).first()
                    if not theme:
                        theme = Theme(name=theme_name)
                        session.add(theme)
                        session.flush()
                    anime.themes.append(theme)
            
            # Demographics
            if 'demographics' in row and not pd.isna(row['demographics']):
                demographic_names = parse_list(row['demographics'])
                for demo_name in demographic_names:
                    demo = session.query(Demographic).filter_by(name=demo_name).first()
                    if not demo:
                        demo = Demographic(name=demo_name)
                        session.add(demo)
                        session.flush()
                    anime.demographics.append(demo)
            
            # Producers
            if 'producers' in row and not pd.isna(row['producers']):
                producer_names = parse_list(row['producers'])
                for producer_name in producer_names:
                    producer = session.query(Producer).filter_by(name=producer_name).first()
                    if not producer:
                        producer = Producer(name=producer_name)
                        session.add(producer)
                        session.flush()
                    anime.producers.append(producer)
            
            # Licensors
            if 'licensors' in row and not pd.isna(row['licensors']):
                licensor_names = parse_list(row['licensors'])
                for licensor_name in licensor_names:
                    licensor = session.query(Licensor).filter_by(name=licensor_name).first()
                    if not licensor:
                        licensor = Licensor(name=licensor_name)
                        session.add(licensor)
                        session.flush()
                    anime.licensors.append(licensor)
            
            # Studios
            if 'studios' in row and not pd.isna(row['studios']):
                studio_names = parse_list(row['studios'])
                for studio_name in studio_names:
                    studio = session.query(Studio).filter_by(name=studio_name).first()
                    if not studio:
                        studio = Studio(name=studio_name)
                        session.add(studio)
                        session.flush()
                    anime.studios.append(studio)
            
            # Thêm anime vào phiên làm việc
            session.add(anime)
            
            # Lưu và commit sau mỗi 10 bản ghi để tránh mất dữ liệu nếu có lỗi
            if (idx + 1) % 10 == 0:
                try:
                    session.commit()
                    print(f"Đã commit {idx + 1} bản ghi")
                except Exception as e:
                    session.rollback()
                    print(f"Lỗi khi commit tại bản ghi {idx + 1}: {str(e)}")
                    raise e
            
        # Lưu tất cả thay đổi còn lại
        session.commit()
        print("Import thành công!")
    
    except Exception as e:
        session.rollback()
        print(f"Lỗi khi nhập dữ liệu: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    if os.path.exists(CSV_FILE_PATH):
        import_data_from_csv(CSV_FILE_PATH)
    else:
        print(f"File không tồn tại: {CSV_FILE_PATH}")
        print(f"Thư mục hiện tại: {os.getcwd()}")
        print("Vui lòng kiểm tra lại đường dẫn đến file CSV.")