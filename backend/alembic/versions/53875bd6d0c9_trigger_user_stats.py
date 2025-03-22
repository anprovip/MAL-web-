"""trigger_user_stats

Revision ID: 53875bd6d0c9
Revises: c55d52e64862
Create Date: 2025-03-21 10:16:38.738977

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '53875bd6d0c9'
down_revision: Union[str, None] = 'c55d52e64862'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    conn = op.get_bind()
    conn.execute(sa.text(
    """
    CREATE OR REPLACE FUNCTION update_user_stats_table()
    RETURNS TRIGGER AS $$
    BEGIN
        RAISE NOTICE 'Updating user_stats table: Operation=%, user_id=%, my_score=%', 
            TG_OP, 
            CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END,
            CASE WHEN TG_OP = 'DELETE' THEN OLD.my_score ELSE NEW.my_score END;

        -- Tạo user_stats nếu chưa tồn tại
        INSERT INTO user_stats (user_id, total_anime, total_anime_rated, mean_score)
        SELECT 
            CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END, 
            0, 0, 0
        WHERE NOT EXISTS (
            SELECT 1 FROM user_stats 
            WHERE user_id = CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END
        );

        IF TG_OP = 'INSERT' THEN
            UPDATE user_stats
            SET total_anime = GREATEST(COALESCE(total_anime, 0) + 1, 0),
                total_anime_rated = GREATEST(COALESCE(total_anime_rated, 0) + CASE WHEN NEW.my_score > 0 THEN 1 ELSE 0 END, 0),
                mean_score = CASE 
                    WHEN COALESCE(total_anime_rated, 0) = 0 AND NEW.my_score > 0 THEN NEW.my_score
                    WHEN COALESCE(total_anime_rated, 0) > 0 AND NEW.my_score > 0 THEN 
                        (COALESCE(mean_score, 0) * COALESCE(total_anime_rated, 0) + NEW.my_score) / (COALESCE(total_anime_rated, 0) + 1)
                    ELSE COALESCE(mean_score, 0)
                END
            WHERE user_id = NEW.user_id;
        
        ELSIF TG_OP = 'UPDATE' THEN
            -- Lấy giá trị hiện tại của total_anime_rated để check
            DECLARE
                current_rated INT;
            BEGIN
                SELECT COALESCE(total_anime_rated, 0) INTO current_rated
                FROM user_stats
                WHERE user_id = NEW.user_id;
                
                RAISE NOTICE 'Current total_anime_rated for user_id=%: %', NEW.user_id, current_rated;
                
                UPDATE user_stats
                SET total_anime_rated = GREATEST(COALESCE(total_anime_rated, 0) 
                    + CASE WHEN NEW.my_score > 0 AND OLD.my_score = 0 THEN 1
                        WHEN NEW.my_score = 0 AND OLD.my_score > 0 THEN -1
                        ELSE 0 END, 0),
                    mean_score = CASE
                        -- Khi chưa đánh giá -> có đánh giá
                        WHEN OLD.my_score = 0 AND NEW.my_score > 0 THEN
                            CASE 
                                WHEN current_rated = 0 THEN NEW.my_score
                                ELSE (COALESCE(mean_score, 0) * current_rated + NEW.my_score) / (current_rated + 1)
                            END
                        -- Khi đã đánh giá -> không đánh giá
                        WHEN OLD.my_score > 0 AND NEW.my_score = 0 THEN
                            CASE WHEN current_rated > 1 THEN
                                (COALESCE(mean_score, 0) * current_rated - OLD.my_score) / (current_rated - 1)
                            ELSE 0 END
                        -- Khi thay đổi đánh giá
                        WHEN OLD.my_score > 0 AND NEW.my_score > 0 THEN
                            CASE 
                                WHEN current_rated = 0 THEN NEW.my_score
                                ELSE COALESCE(mean_score, 0) + (NEW.my_score - OLD.my_score) / GREATEST(current_rated, 1)
                            END
                        ELSE COALESCE(mean_score, 0)
                    END
                WHERE user_id = NEW.user_id;
            END;
        
        ELSIF TG_OP = 'DELETE' THEN
            -- Lấy giá trị hiện tại của total_anime_rated để check
            DECLARE
                current_rated INT;
            BEGIN
                SELECT COALESCE(total_anime_rated, 0) INTO current_rated
                FROM user_stats
                WHERE user_id = OLD.user_id;
                
                RAISE NOTICE 'Current total_anime_rated for user_id=%: %', OLD.user_id, current_rated;
                
                UPDATE user_stats
                SET total_anime = GREATEST(COALESCE(total_anime, 0) - 1, 0),
                    total_anime_rated = GREATEST(COALESCE(total_anime_rated, 0) - CASE WHEN OLD.my_score > 0 THEN 1 ELSE 0 END, 0),
                    mean_score = CASE 
                        WHEN current_rated <= 1 THEN 0
                        WHEN OLD.my_score > 0 THEN 
                            (COALESCE(mean_score, 0) * current_rated - OLD.my_score) / (current_rated - 1)
                        ELSE COALESCE(mean_score, 0)
                    END
                WHERE user_id = OLD.user_id;
            END;
        END IF;

        RETURN NULL; -- Sử dụng NULL với trigger AFTER
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_update_user_stats_table
    AFTER INSERT OR UPDATE OR DELETE
    ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_table();
    """
    ))

def downgrade():
    # conn = op.get_bind()
    # conn.execute("DROP TRIGGER IF EXISTS update_user_stats_table ON ratings;")
    # conn.execute("DROP FUNCTION IF EXISTS update_user_stats_table;")
    pass
