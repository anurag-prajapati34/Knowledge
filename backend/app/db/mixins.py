from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy import String,Integer,DateTime
from datetime import datetime
from sqlalchemy.sql import func

class CommonMixins:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )