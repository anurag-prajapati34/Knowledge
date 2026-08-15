from pydantic import BaseModel


class CreateKB(BaseModel):
    name: str
    description: str = ""  # make it optional


class QueryKB(BaseModel):
    prompt: str


class SourceCitation(BaseModel):
    document_id: int
    filename: str
    chunk_index: int
