import asyncio

from app.config import settings
from app.models.chunks import Chunk
from app.models.documents import Documents
from app.services.embeding_service import embed_texts
from app.utils.chunking import chunk_text
from app.utils.enums import DocStatus
from app.utils.file_parser import extract_text
from app.workers.celery_app import celery_app
from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
)


@celery_app.task(name="process_document")
def process_document_task(document_id: int):
    return asyncio.run(process_document(document_id))


async def process_document(document_id: int):

    engine = create_async_engine(
        settings.database_url,
    )

    SessionLocal = async_sessionmaker(
        bind=engine,
        expire_on_commit=False,
    )

    try:
        async with SessionLocal() as db:
            result = await db.execute(
                select(Documents).where(Documents.id == document_id)
            )

            doc = result.scalar_one_or_none()

            if doc is None:
                return

            try:
                doc.doc_status = DocStatus.PROCESSING
                await db.commit()

                raw_text = extract_text(
                    doc.file_path,
                    doc.file_type,
                )

                if not raw_text:
                    raise ValueError("No extractable text found in document")

                text_chunks = chunk_text(raw_text, chunk_size=500, overlap=50)
                embeddings = embed_texts(text_chunks)

                for idx, (content, embedding) in enumerate(
                    zip(text_chunks, embeddings)
                ):
                    chunk = Chunk(
                        kb_id=doc.kb_id,
                        document_id=doc.id,
                        chunk_index=idx,
                        content=content,
                        embedding=embedding,
                    )

                    db.add(chunk)

                doc.doc_status = DocStatus.PROCESSED
                await db.commit()

            except Exception:
                await db.rollback()

                doc.doc_status = DocStatus.FAILED
                await db.commit()

                raise

    finally:
        await engine.dispose()
