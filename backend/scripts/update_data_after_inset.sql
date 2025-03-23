-- Script cập nhật lại dữ liệu cho 3 trigger
-- Bao gồm cập nhật: user_stats, mal_stats, và users dựa trên bảng ratings

-- 1. Cập nhật bảng user_stats
-- Xử lý như trigger thứ nhất
BEGIN;

-- Tạo user_stats cho tất cả user chưa có trong bảng
INSERT INTO user_stats (user_id, total_anime, total_anime_rated, mean_score)
SELECT DISTINCT user_id, 0, 0, 0
FROM ratings
WHERE user_id NOT IN (SELECT user_id FROM user_stats);

-- Cập nhật total_anime và total_anime_rated cho mỗi user
UPDATE user_stats us
SET 
    total_anime = anime_counts.total,
    total_anime_rated = anime_counts.rated,
    mean_score = CASE 
        WHEN anime_counts.rated > 0 THEN anime_counts.total_score / anime_counts.rated
        ELSE 0
    END
FROM (
    SELECT 
        user_id,
        COUNT(*) AS total,
        COUNT(CASE WHEN my_score > 0 THEN 1 END) AS rated,
        SUM(CASE WHEN my_score > 0 THEN my_score ELSE 0 END) AS total_score
    FROM ratings
    GROUP BY user_id
) AS anime_counts
WHERE us.user_id = anime_counts.user_id;

COMMIT;

-- 2. Cập nhật bảng mal_stats
-- Xử lý như trigger thứ hai
BEGIN;

-- Tạo mal_stats cho tất cả anime chưa có trong bảng
INSERT INTO mal_stats (anime_id, score, scored_by, members, rank)
SELECT DISTINCT anime_id, 0, 0, 0, NULL::integer
FROM ratings
WHERE anime_id NOT IN (SELECT anime_id FROM mal_stats);

-- Cập nhật score, scored_by và members cho mỗi anime
UPDATE mal_stats ms
SET 
    members = anime_stats.total_members,
    scored_by = anime_stats.total_scored,
    score = CASE 
        WHEN anime_stats.total_scored > 0 THEN anime_stats.total_score / anime_stats.total_scored
        ELSE 0
    END
FROM (
    SELECT 
        anime_id,
        COUNT(*) AS total_members,
        COUNT(CASE WHEN my_score > 0 THEN 1 END) AS total_scored,
        SUM(CASE WHEN my_score > 0 THEN my_score ELSE 0 END) AS total_score
    FROM ratings
    GROUP BY anime_id
) AS anime_stats
WHERE ms.anime_id = anime_stats.anime_id;

COMMIT;

-- 3. Cập nhật bảng users
-- Xử lý như trigger thứ ba
BEGIN;

-- Cập nhật trạng thái xem của mỗi user
UPDATE users u
SET 
    user_watching = status_counts.watching,
    user_completed = status_counts.completed,
    user_onhold = status_counts.onhold,
    user_dropped = status_counts.dropped,
    user_plantowatch = status_counts.plantowatch
FROM (
    SELECT 
        user_id,
        COUNT(CASE WHEN my_status = 1 THEN 1 END) AS watching,
        COUNT(CASE WHEN my_status = 2 THEN 1 END) AS completed,
        COUNT(CASE WHEN my_status = 3 THEN 1 END) AS onhold,
        COUNT(CASE WHEN my_status = 4 THEN 1 END) AS dropped,
        COUNT(CASE WHEN my_status = 5 THEN 1 END) AS plantowatch
    FROM ratings
    GROUP BY user_id
) AS status_counts
WHERE u.user_id = status_counts.user_id;
COMMIT;