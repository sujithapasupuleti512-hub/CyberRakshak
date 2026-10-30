"""Scan history model (stores URL / domain analysis results)."""

from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    # Nullable so anonymous scans can still be analysed (not persisted history).
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    scan_type = Column(String(16), nullable=False)  # "url" | "domain"
    target = Column(String(2048), nullable=False)
    risk = Column(String(32), nullable=False)
    score = Column(Integer, nullable=False, default=0)
    details = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    owner = relationship("User", back_populates="scans")
