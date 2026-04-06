import traceback
try:
    from app.db.database import SessionLocal
    from sqlalchemy import text
    db = SessionLocal()
    print(db.execute(text('SELECT 1')).scalar())
    db.close()
    print("SUCCESS")
except Exception as e:
    with open("error_log.txt", "w") as f:
        f.write(traceback.format_exc())
