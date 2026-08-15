from app.db.session import get_db
from app.dependencies.auth import authenticate
from app.schemas.auth import JWTPayload
from app.schemas.kb import CreateKB, QueryKB
from app.services.kb_service import (
    create_kb_service,
    delete_kb_document_service,
    delete_kb_service,
    get_document_service,
    get_kb_documents_service,
    get_kb_service,
    get_kbs_service,
    query_kb_service,
    update_kb_service,
    upload_kb_documents_service,
)
from fastapi import APIRouter, Depends, UploadFile
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/kb", tags=["Knowledge Base"])


# middlware for bearer token verification and user authorization

security = HTTPBearer()


@router.post("/")
async def create(
    data: CreateKB,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await create_kb_service(db=db, data=data, user=user)
    return {"message": "success", "data": result}


@router.get("/")
async def get_kbs(
    user: JWTPayload = Depends(authenticate), db: AsyncSession = Depends(get_db)
):
    result = await get_kbs_service(db=db, user=user)
    return {"message": "success", "data": result}


@router.post("/{kb_id}/documents")
async def upload_kb_documents(
    kb_id: int,
    file: UploadFile,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await upload_kb_documents_service(db=db, kb_id=kb_id, file=file, user=user)

    return {"message": "success", "data": result}


@router.get("/{kb_id}/documents")
async def get_kb_documents(
    kb_id: int,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await get_kb_documents_service(db=db, kb_id=kb_id)
    return {"message": "success", "data": result}


@router.post("/{kb_id}/query")
async def query_kb(
    kb_id: int,
    data: QueryKB,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await query_kb_service(db=db, kb_id=kb_id, data=data, user=user)
    return {"message": "success", "data": result}


@router.delete("/{kb_id}")
async def delete_kb(
    kb_id: int,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await delete_kb_service(db=db, kb_id=kb_id, user=user)
    return {"message": "success", "data": result}


@router.delete("/{kb_id}/documents/{document_id}")
async def delete_document(
    kb_id: int,
    document_id: int,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await delete_kb_document_service(
        db=db, kb_id=kb_id, document_id=document_id, user=user
    )
    return {"message": "success", "data": result}


@router.get("/{kb_id}")
async def get_kb(
    kb_id: int,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await get_kb_service(db=db, kb_id=kb_id, user=user)
    return {"message": "success", "data": result}


@router.put("/{kb_id}")
async def update_kb(
    kb_id: int,
    data: CreateKB,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await update_kb_service(db=db, kb_id=kb_id, data=data, user=user)
    return {"message": "success", "data": result}


@router.get("/{kb_id}/documents/{document_id}")
async def get_document_status(
    kb_id: int,
    document_id: int,
    user: JWTPayload = Depends(authenticate),
    db: AsyncSession = Depends(get_db),
):
    result = await get_document_service(
        db=db, kb_id=kb_id, document_id=document_id, user=user
    )
    return {"message": "success", "data": result}
