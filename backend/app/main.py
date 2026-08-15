from fastapi import FastAPI

app = FastAPI()
# fix cors
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.kb import router as kb_router

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health")
async def health():
    return {"message": "Healthy"}


# Routers
# /api/*
app.include_router(auth_router, prefix="/api")
app.include_router(kb_router, prefix="/api")
