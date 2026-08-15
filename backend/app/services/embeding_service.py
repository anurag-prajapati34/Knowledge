from app.config import settings
from langchain_huggingface import HuggingFaceEmbeddings

_model = None


def get_embeding_model() -> HuggingFaceEmbeddings:
    global _model
    if _model == None:
        _model = HuggingFaceEmbeddings(model_name=settings.embedding_model)

    return _model


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_embeding_model()
    embedding = model.embed_documents(texts)

    return embedding
