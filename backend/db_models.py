from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, String, Text
from sql_db import Base


class Profile(Base):
    __tablename__ = "profiles"

    id            = Column(Integer, primary_key=True, index=True)
    display_name  = Column(String(100), nullable=False)
    username      = Column(String(50),  unique=True, index=True, nullable=False)
    email         = Column(String(200), unique=True, index=True, nullable=False)
    bio           = Column(Text,        nullable=True)
    favorite_game = Column(String(20),  nullable=False, default="all")
    avatar_color  = Column(String(7),   nullable=False, default="#C9A84C")
    plan          = Column(String(20),  nullable=False, default="free")
    cards_graded  = Column(Integer,     nullable=False, default=0)
    created_at    = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
