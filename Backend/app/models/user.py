from sqlalchemy import String, Integer
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .base import Base


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    wallets = relationship(
        "Wallets", back_populates="user", cascade="all, delete-orphan"
    )
    sent_transactions = relationship(
        "Transactions",
        foreign_keys="Transactions.sender_id",
        back_populates="send_user",
    )
    received_transactions = relationship(
        "Transactions",
        foreign_keys="Transactions.receiver_id",
        back_populates="rec_user",
    )

    def __repr__(self):
        return f"""<Event(
            id='{self.id}',
            name='{self.name}',
            email='{self.email}'
        )>"""
