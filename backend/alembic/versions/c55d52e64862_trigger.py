"""trigger

Revision ID: c55d52e64862
Revises: 58971ff30535
Create Date: 2025-03-20 23:53:39.659535

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c55d52e64862'
down_revision: Union[str, None] = '58971ff30535'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None




def upgrade():
    conn = op.get_bind()
    conn.execute(sa.text(
    """
    CREATE OR REPLACE FUNCTION update_users()
    RETURNS TRIGGER AS $$
    BEGIN
        RAISE NOTICE 'Updating users table: Operation=%, user_id=%', 
            TG_OP, 
            CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END;

        IF TG_OP = 'INSERT' THEN
            UPDATE users
            SET user_watching = user_watching + CASE WHEN NEW.my_status = 1 THEN 1 ELSE 0 END,
                user_completed = user_completed + CASE WHEN NEW.my_status = 2 THEN 1 ELSE 0 END,
                user_onhold = user_onhold + CASE WHEN NEW.my_status = 3 THEN 1 ELSE 0 END,
                user_dropped = user_dropped + CASE WHEN NEW.my_status = 4 THEN 1 ELSE 0 END,
                user_plantowatch = user_plantowatch + CASE WHEN NEW.my_status = 5 THEN 1 ELSE 0 END
            WHERE user_id = NEW.user_id;
        
        ELSIF TG_OP = 'UPDATE' THEN
            UPDATE users
            SET user_watching = user_watching 
                + CASE WHEN NEW.my_status = 1 AND OLD.my_status != 1 THEN 1 
                    WHEN NEW.my_status != 1 AND OLD.my_status = 1 THEN -1 
                    ELSE 0 END,
                user_completed = user_completed 
                + CASE WHEN NEW.my_status = 2 AND OLD.my_status != 2 THEN 1 
                    WHEN NEW.my_status != 2 AND OLD.my_status = 2 THEN -1 
                    ELSE 0 END,
                user_onhold = user_onhold 
                + CASE WHEN NEW.my_status = 3 AND OLD.my_status != 3 THEN 1 
                    WHEN NEW.my_status != 3 AND OLD.my_status = 3 THEN -1 
                    ELSE 0 END,
                user_dropped = user_dropped 
                + CASE WHEN NEW.my_status = 4 AND OLD.my_status != 4 THEN 1 
                    WHEN NEW.my_status != 4 AND OLD.my_status = 4 THEN -1 
                    ELSE 0 END,
                user_plantowatch = user_plantowatch 
                + CASE WHEN NEW.my_status = 5 AND OLD.my_status != 5 THEN 1 
                    WHEN NEW.my_status != 5 AND OLD.my_status = 5 THEN -1 
                    ELSE 0 END
            WHERE user_id = NEW.user_id;
        
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE users
            SET user_watching = user_watching - CASE WHEN OLD.my_status = 1 THEN 1 ELSE 0 END,
                user_completed = user_completed - CASE WHEN OLD.my_status = 2 THEN 1 ELSE 0 END,
                user_onhold = user_onhold - CASE WHEN OLD.my_status = 3 THEN 1 ELSE 0 END,
                user_dropped = user_dropped - CASE WHEN OLD.my_status = 4 THEN 1 ELSE 0 END,
                user_plantowatch = user_plantowatch - CASE WHEN OLD.my_status = 5 THEN 1 ELSE 0 END
            WHERE user_id = OLD.user_id;
        END IF;

        RETURN NULL; -- Sử dụng NULL với trigger AFTER
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_update_users_stats
    AFTER INSERT OR UPDATE OR DELETE
    ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_users();
    """
    ))

def downgrade():
    # conn = op.get_bind()
    # conn.execute("DROP TRIGGER IF EXISTS update_users ON ratings;")
    # conn.execute("DROP FUNCTION IF EXISTS update_users;")
    pass