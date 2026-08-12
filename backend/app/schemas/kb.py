from pydantic import BaseModel


class CreateKB(BaseModel):
    name: str
