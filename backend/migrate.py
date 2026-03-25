"""
Script de migración para añadir la columna 'role' a la tabla 'users'
y crear la tabla 'teacher_codes', respetando las tablas existentes.
Run once with: .\\venv\\Scripts\\python migrate.py
"""
import enum
from sqlalchemy import text
from app.db.database import engine

def run_migrations():
    with engine.connect() as conn:
        try:
            # 1. Crear el tipo Enum (falla silenciosamente si ya existe capturando error)
            conn.execute(text("CREATE TYPE user_role_enum AS ENUM ('estudiante', 'profesor', 'admin');"))
            print("Type 'user_role_enum' created.")
        except Exception as e:
            print(f"user_role_enum (already exists or error)")
            
        try:
            # 2. Añadir la columna de rol a users
            conn.execute(text("ALTER TABLE users ADD COLUMN role user_role_enum NOT NULL DEFAULT 'estudiante';"))
            print("Added 'role' column to users.")
        except Exception as e:
            print(f"role column (already exists or error)")

        try:
            # 3. Crear tabla teacher_codes
            conn.execute(text('''
                CREATE TABLE teacher_codes (
                    id SERIAL PRIMARY KEY,
                    code VARCHAR(50) UNIQUE NOT NULL,
                    is_used BOOLEAN DEFAULT FALSE,
                    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL
                );
            '''))
            print("Table 'teacher_codes' created.")
        except Exception as e:
            print(f"teacher_codes table (already exists or error)")
        
        try:
            # Crear indice para busquedas rapidas de codigo
            conn.execute(text("CREATE INDEX idx_teacher_codes_code ON teacher_codes(code);"))
            print("Index 'idx_teacher_codes_code' created.")
        except Exception as e:
            pass

        conn.commit()
        print("Migration complete.")

if __name__ == "__main__":
    run_migrations()
