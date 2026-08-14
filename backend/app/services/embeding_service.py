from app.config import settings
from sentence_transformers import SentenceTransformer

_model = None


def get_embeding_model() -> SentenceTransformer:
    global _model
    if _model == None:
        _model = SentenceTransformer(settings.embedding_model)

    return _model


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_embeding_model()
    embedding = model.encode(texts)

    return embedding.tolist()
