"""
Quick migration script to add phone and avatar_url columns to users table.
Run once with: .\\venv\\Scripts\\python migrate.py
"""
from sqlalchemy import text
from app.db.database import engine

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR;"))
        print("Added: phone")
    except Exception as e:
        print(f"phone (already exists or error): {e}")

    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR;"))
        print("Added: avatar_url")
    except Exception as e:
        print(f"avatar_url (already exists or error): {e}")

    conn.commit()
    print("Migration complete.")
