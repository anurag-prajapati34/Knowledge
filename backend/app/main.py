from fastapi import FastAPI

app = FastAPI()
from app.api.auth import router as auth_router
from app.api.kb import router as kb_router


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
