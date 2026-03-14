from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth, users
from app.db.database import engine, Base

# Create database tables automatically for MVP purpose
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIPRO UDC MVP API")

# Configure CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
