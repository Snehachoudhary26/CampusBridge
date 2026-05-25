from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, listings, categories, chat, predict, messages, analytics, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusBridge API",
    description="AI-powered campus marketplace for RGPV Bhopal students",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(listings.router)
app.include_router(categories.router)
app.include_router(chat.router)
app.include_router(predict.router)
app.include_router(messages.router)
app.include_router(analytics.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to CampusBridge API",
        "campus": "RGPV Bhopal",
        "version": "1.0.0",
        "docs": "/docs"
    }
