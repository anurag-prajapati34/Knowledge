from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy import String,Integer,DateTime,ForeignKey
from datetime import datetime
from sqlalchemy.sql import func
from app.db.base import Base
from app.db.mixins import CommonMixins
class KnowledgeBase(Base,CommonMixins):
    __tablename__="knowledge_bases"

    id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
    name:Mapped[str]=mapped_column(String(100),nullable=False)
    user_id:Mapped[int]=mapped_column(Integer,ForeignKey("users.id"),nullable=False, )