"""Scientific Provider catalog model."""
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.database.base import Base


class ProviderModel(Base):
    """Scientific Provider table (ARGO GDAC, ERDDAP, Argovis, INCOIS)."""
    __tablename__ = "providers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    url: Mapped[str] = mapped_column(String(255), nullable=True)
