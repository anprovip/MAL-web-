import time
import threading
import logging
import schedule
from datetime import datetime
from sqlalchemy import text
from .database import engine

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_anime_ranks():
    """Cập nhật xếp hạng anime và mức độ phổ biến mỗi 8 giờ"""
    try:
        logger.info(f"Bắt đầu cập nhật xếp hạng anime: {datetime.now()}")
        
        with engine.begin() as conn:
            # Cập nhật xếp hạng dựa trên điểm số
            conn.execute(text("""
                WITH ranked_anime AS (
                    SELECT anime_id, ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
                    FROM mal_stats
                    WHERE score > 0
                )
                UPDATE mal_stats m
                SET rank = r.new_rank
                FROM ranked_anime r
                WHERE m.anime_id = r.anime_id;
            """))
            
            # Đặt rank thành NULL cho anime chưa được đánh giá
            conn.execute(text("""
                UPDATE mal_stats
                SET rank = NULL
                WHERE score = 0;
            """))
            
            # Cập nhật popularity rank dựa trên members
            conn.execute(text("""
                WITH ranked_by_members AS (
                    SELECT anime_id, ROW_NUMBER() OVER (ORDER BY members DESC) as popularity_rank
                    FROM mal_stats
                    WHERE members > 0
                )
                UPDATE mal_stats m
                SET popularity = r.popularity_rank
                FROM ranked_by_members r
                WHERE m.anime_id = r.anime_id;
            """))
            
        logger.info(f"Hoàn thành cập nhật xếp hạng anime: {datetime.now()}")
    except Exception as e:
        logger.error(f"Lỗi khi cập nhật xếp hạng anime: {e}")

def run_scheduler():
    """Chạy bộ lập lịch trong một thread riêng biệt"""
    # Chạy cập nhật khi khởi động
    update_anime_ranks()
    
    # Lập lịch chạy mỗi 8 giờ
    #schedule.every(8).hours.do(update_anime_ranks)
    schedule.every(20).seconds.do(update_anime_ranks)
    # Vòng lặp chạy bộ lập lịch
    while True:
        schedule.run_pending()
        time.sleep(25)  # Kiểm tra mỗi phút

def start_scheduler():
    """Khởi động bộ lập lịch trong thread riêng"""
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    logger.info("Bộ lập lịch cập nhật xếp hạng đã được khởi động")
    return scheduler_thread