from sqlalchemy import text
from src.core.db import engine

def add_color_column() -> None:
    print('🔧 Adding color_id column to tags table...')
    with engine.begin() as conn:
        # Check if column already exists
        check_query = text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tags' AND column_name = 'color_id'
        """)
        result = conn.execute(check_query)
        if result.fetchone():
            print('✅ Column color_id already exists in tags table.')
            return
        
        # Add color_id column with default value 0 (Gray)
        alter_query = text("""
            ALTER TABLE tags 
            ADD COLUMN color_id INTEGER NOT NULL DEFAULT 0
        """)
        conn.execute(alter_query)
        print('✅ Successfully added color_id column to tags table!')

if __name__ == '__main__':
    try:
        add_color_column()
    except Exception as e:
        print(f'❌ Error: {e}')
        raise

