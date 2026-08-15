import os
import uuid

from app.config import settings
from app.models.chunks import Chunk
from app.models.documents import Documents
from app.models.knowledge_bases import KnowledgeBase
from app.schemas.auth import JWTPayload
from app.schemas.kb import CreateKB, QueryKB, SourceCitation
from app.services.embeding_service import embed_texts
from app.services.llm_service import generate_answer
from app.utils.enums import DocStatus
from app.workers.tasks.process_document import process_document_task
from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


async def create_kb_service(db: AsyncSession, data: CreateKB, user: JWTPayload):
    new_kb = KnowledgeBase(
        name=data.name, description=data.description, user_id=user.id
    )
    db.add(new_kb)
    await db.commit()
    await db.refresh(new_kb)
    return new_kb


async def get_kbs_service(db: AsyncSession, user: JWTPayload):
    result = await db.execute(
        select(KnowledgeBase).where(KnowledgeBase.user_id == user.id)
    )
    return result.scalars().all()


async def verfiy_kb_ownership(db: AsyncSession, kb_id: int, user: JWTPayload):
    result = await db.execute(
        select(KnowledgeBase).where(
            KnowledgeBase.id == kb_id and KnowledgeBase.user_id == user.id
        )
    )
    return result.scalar_one_or_none()


async def upload_kb_documents_service(
    db: AsyncSession, kb_id: int, file: UploadFile, user: JWTPayload
):
    # verify kb ownership
    kb = await verfiy_kb_ownership(db=db, kb_id=kb_id, user=user)

    if kb == None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
        )

    if file.filename == None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
        )

    ext = os.path.splitext(file.filename)[1].lower()

    ALLOWED_EXTENSIONS = [".txt", ".pdf", ".docx"]
    UPLOAD_DIR = "uploads"

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type"
        )

    # save file into disk
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    stored_filename = f"{uuid.uuid4().hex}{ext}"
    stored_file_path = os.path.join(UPLOAD_DIR, stored_filename)

    # read content from file
    content = await file.read()

    with open(stored_file_path, "wb") as f:
        f.write(content)

    # save file into db

    new_doc = Documents(
        kb_id=kb.id,
        file_name=stored_filename,
        file_path=stored_file_path,
        file_type=ext,
        user_id=user.id,
        doc_status=DocStatus.PENDING,
        description="",
    )

    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)

    process_document_task.delay(new_doc.id)
    return new_doc


async def get_kb_documents_service(db: AsyncSession, kb_id: int):
    result = await db.execute(select(Documents).where(Documents.kb_id == kb_id))
    return result.scalars().all()


async def query_kb_service(
    db: AsyncSession, kb_id: int, data: QueryKB, user: JWTPayload
):
    # verify kb ownership
    kb = await verfiy_kb_ownership(db=db, kb_id=kb_id, user=user)

    if kb == None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
        )

    question = data.prompt

    query_embedding = embed_texts([question])[0]

    stmt = (
        select(Chunk, Documents.file_name)
        .join(Documents, Chunk.document_id == Documents.id)
        .where(Chunk.kb_id == kb_id)
        .order_by(Chunk.embedding.cosine_distance(query_embedding))
        .limit(5)
    )
    result = await db.execute(stmt)
    rows = result.all()

    if not rows:
        return {
            "answer": "No documents have been processed in this knowledge base yet.",
            "sources": [],
        }

    print("api key ---", settings.gemini_api_key)
    context_parts = []
    sources = []
    for chunk, filename in rows:
        context_parts.append(
            f"[Source: {filename}, chunk {chunk.chunk_index}]\n{chunk.content}"
        )
        sources.append(
            SourceCitation(
                document_id=chunk.document_id,
                filename=filename,
                chunk_index=chunk.chunk_index,
            )
        )

    context = "\n\n---\n\n".join(context_parts)
    answer = ""
    answer = generate_answer(question=question, context=context)

    # result = await db.execute(select(Documents).where(Documents.kb_id == kb_id))
    return answer


async def delete_kb_service(db: AsyncSession, kb_id: int, user: JWTPayload):
    # verify kb ownership
    kb = await verfiy_kb_ownership(db=db, kb_id=kb_id, user=user)

    if kb == None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
        )

    await db.delete(kb)
    await db.commit()

    return kb


async def delete_kb_document_service(
    db: AsyncSession, kb_id: int, document_id: int, user: JWTPayload
):
    # verify kb ownership
    doc = await db.execute(
        select(Documents).where(
            Documents.id == document_id
            and Documents.kb_id == kb_id
            and Documents.user_id == user.id
        )
    )
    doc = doc.scalar_one_or_none()

    if doc == None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
        )

    await db.delete(doc)
    await db.commit()

    return doc


async def get_kb_service(db: AsyncSession, kb_id: int, user: JWTPayload):
    result = await verfiy_kb_ownership(db=db, kb_id=kb_id, user=user)

    if result == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge base not found"
        )
    return result


async def update_kb_service(
    db: AsyncSession, kb_id: int, data: CreateKB, user: JWTPayload
):
    result = await verfiy_kb_ownership(db=db, kb_id=kb_id, user=user)

    if result == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge base not found"
        )

    result.name = data.name
    if data.description != None:
        result.description = data.description

    await db.commit()

    return result


async def get_document_service(
    db: AsyncSession, kb_id: int, document_id: int, user: JWTPayload
):
    result = await db.execute(
        select(Documents).where(
            Documents.id == document_id
            and Documents.kb_id == kb_id
            and Documents.user_id == user.id
        )
    )

    doc = result.scalar_one_or_none()
    if doc == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )

    return doc
