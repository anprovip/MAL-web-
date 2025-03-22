
    BEGIN
        RAISE NOTICE 'Updating mal_stats table: Operation=%, anime_id=%, my_score=%', 
            TG_OP, 
            CASE WHEN TG_OP = 'DELETE' THEN OLD.anime_id ELSE NEW.anime_id END,
            CASE WHEN TG_OP = 'DELETE' THEN OLD.my_score ELSE NEW.my_score END;

        -- Tạo mal_stats nếu chưa tồn tại
        INSERT INTO mal_stats (anime_id, score, scored_by, members, rank)
        SELECT 
            CASE WHEN TG_OP = 'DELETE' THEN OLD.anime_id ELSE NEW.anime_id END, 
            0, 0, 0, NULL
        WHERE NOT EXISTS (
            SELECT 1 FROM mal_stats 
            WHERE anime_id = CASE WHEN TG_OP = 'DELETE' THEN OLD.anime_id ELSE NEW.anime_id END
        );

        IF TG_OP = 'INSERT' THEN
            UPDATE mal_stats
            SET score = CASE
                    WHEN scored_by IS NULL OR scored_by = 0 AND NEW.my_score > 0 THEN NEW.my_score
                    WHEN COALESCE(scored_by, 0) > 0 AND NEW.my_score > 0 THEN
                        (COALESCE(score, 0) * COALESCE(scored_by, 0) + NEW.my_score) / (COALESCE(scored_by, 0) + 1)
                    ELSE COALESCE(score, 0)
                END,
                scored_by = GREATEST(COALESCE(scored_by, 0) + CASE WHEN NEW.my_score > 0 THEN 1 ELSE 0 END, 0),
                members = GREATEST(COALESCE(members, 0) + 1)
            WHERE anime_id = NEW.anime_id;
        
        ELSIF TG_OP = 'UPDATE' THEN
            -- Xử lý các trường hợp cập nhật
            IF OLD.my_score = 0 AND NEW.my_score > 0 THEN
                -- Khi chuyển từ không đánh giá sang có đánh giá
                UPDATE mal_stats
                SET score = CASE 
                        WHEN scored_by IS NULL OR scored_by = 0 THEN NEW.my_score
                        ELSE (COALESCE(score, 0) * COALESCE(scored_by, 0) + NEW.my_score) / (COALESCE(scored_by, 0) + 1)
                    END,
                    scored_by = GREATEST(COALESCE(scored_by, 0) + 1, 0)
                WHERE anime_id = NEW.anime_id;
                
                RAISE NOTICE 'Updated from score 0 to %: anime_id=%', NEW.my_score, NEW.anime_id;
                
            ELSIF OLD.my_score > 0 AND NEW.my_score = 0 THEN
                -- Khi chuyển từ có đánh giá sang không đánh giá
                UPDATE mal_stats
                SET score = CASE WHEN COALESCE(scored_by, 0) > 1 THEN
                            (COALESCE(score, 0) * COALESCE(scored_by, 0) - OLD.my_score) / (COALESCE(scored_by, 0) - 1)
                        ELSE 0 END,
                    scored_by = GREATEST(COALESCE(scored_by, 0) - 1, 0)  -- Đảm bảo không âm
                WHERE anime_id = NEW.anime_id;
                
            ELSIF OLD.my_score > 0 AND NEW.my_score > 0 THEN
                -- Khi thay đổi giá trị đánh giá
                UPDATE mal_stats
                SET score = CASE WHEN COALESCE(scored_by, 0) > 0 THEN
                            COALESCE(score, 0) + (NEW.my_score - OLD.my_score) / GREATEST(COALESCE(scored_by, 0), 1)
                        ELSE NEW.my_score END
                WHERE anime_id = NEW.anime_id;
            END IF;
        
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE mal_stats
            SET score = CASE 
                    WHEN COALESCE(scored_by, 0) <= 1 THEN 0
                    WHEN OLD.my_score > 0 THEN 
                        (COALESCE(score, 0) * COALESCE(scored_by, 0) - OLD.my_score) / (COALESCE(scored_by, 0) - 1)
                    ELSE COALESCE(score, 0)
                END,
                scored_by = GREATEST(COALESCE(scored_by, 0) - CASE WHEN OLD.my_score > 0 THEN 1 ELSE 0 END, 0),
                members = GREATEST(COALESCE(members, 0) - 1)
            WHERE anime_id = OLD.anime_id;
        END IF;
        

        RETURN NULL; -- Sử dụng NULL với trigger AFTER
    END;
    