from app.db.base import Base
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy import String,Integer,ForeignKey,Text
class Documents(Base):
    __tablename__="documents"
    id: Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
    kb_id: Mapped[int]=mapped_column(Integer,ForeignKey("knowledge_bases.id"),nullable=False, index=True)
    file_name: Mapped[str]=mapped_column(String(100),nullable=False)
    description: Mapped[str]=mapped_column(Text)