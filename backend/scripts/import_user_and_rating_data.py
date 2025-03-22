import sys
import pandas as pd
import os
import time
import concurrent.futures
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

# Import các module từ ứng dụng
current_dir = os.path.dirname(os.path.abspath(__file__))  # scripts
backend_dir = os.path.dirname(current_dir)  # backend
sys.path.append(backend_dir)

from app.models import Base, User, Rating
from app.config import settings
from app.utils import hash

# Định nghĩa đường dẫn file CSV
USER_CSV_FILE_PATH = 'users.csv'
RATING_CSV_FILE_PATH = 'UserAnimeList_filtered.csv'

# Kết nối đến PostgreSQL
db_url = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'
engine = create_engine(db_url)
Session = sessionmaker(bind=engine)

@contextmanager
def session_scope():
    """Quản lý session SQLAlchemy."""
    session = Session()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise
    finally:
        session.close()

def fast_copy_import(file_path, table_name):
    """Nhập dữ liệu nhanh bằng COPY."""
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    with open(file_path, "r", encoding="utf-8") as f:
        cursor.copy_expert(f"COPY {table_name} FROM STDIN WITH CSV HEADER", f)
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ COPY hoàn tất: {file_path} → {table_name}")

def import_data(file_path, model, process_row, batch_size=5000, max_workers=4, use_copy=True):
    """Nhập dữ liệu từ CSV vào database với tối ưu hiệu suất."""
    start_time = time.time()
    total_imported = 0
    error_count = 0
    
    if use_copy:
        try:
            fast_copy_import(file_path, model.__table__.name)
            return
        except Exception as e:
            print(f"⚠️ COPY thất bại, dùng INSERT: {str(e)}")
    
    chunksize = 10000
    chunks = pd.read_csv(file_path, chunksize=chunksize)
    
    def process_chunk(chunk):
        """Xử lý một chunk dữ liệu."""
        imported = 0
        with session_scope() as session:
            records = [process_row(row) for _, row in chunk.iterrows()]
            session.bulk_save_objects(records)
            imported += len(records)
        return imported
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(process_chunk, chunk): chunk for chunk in chunks}
        for future in concurrent.futures.as_completed(futures):
            try:
                total_imported += future.result()
            except Exception as e:
                error_count += 1
    
    elapsed = time.time() - start_time
    print(f"🎉 Import xong! {total_imported} records trong {elapsed:.2f}s")

def process_user_row(row):
    """Xử lý dữ liệu user."""
    email = f"{row['username']}@example.com"
    return User(
        user_id=row['user_id'],
        username=row['username'],
        email=email,
        password=hash('123456'),
        user_watching=row['user_watching'],
        user_completed=row['user_completed'],
        user_onhold=row['user_onhold'],
        user_dropped=row['user_dropped'],
        user_plantowatch=row['user_plantowatch'],
    )

def process_rating_row(row):
    """Xử lý dữ liệu rating."""
    return Rating(
        user_id=row['user_id'],
        mal_id=row['anime_id'],
        my_score=row['my_score'],
        my_status=row['my_status'],
    )

if __name__ == "__main__":
    if os.path.exists(USER_CSV_FILE_PATH):
        import_data(USER_CSV_FILE_PATH, User, process_user_row)
    if os.path.exists(RATING_CSV_FILE_PATH):
        import_data(RATING_CSV_FILE_PATH, Rating, process_rating_row)