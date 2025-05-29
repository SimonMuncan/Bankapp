from sqlalchemy import DECIMAL, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .base import Base


class Wallets(Base):
    __tablename__ = "wallets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    balance: Mapped[DECIMAL] = mapped_column(DECIMAL, nullable=False)

    user = relationship("Users", back_populates="wallets")
