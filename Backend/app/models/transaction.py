from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .base import Base


class Transactions(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sender_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    receiver_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    amount: Mapped[float] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    status: Mapped[bool] = mapped_column(Boolean, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)

    send_user = relationship(
        "Users", foreign_keys=[sender_id], back_populates="sent_transactions"
    )
    rec_user = relationship(
        "Users", foreign_keys=[receiver_id], back_populates="received_transactions"
    )

    def __repr__(self) -> str:
        return f"""<Event(
            id='{self.id}',
            sender_id='{self.sender_id}',
            receiver_id='{self.receiver_id}',
            amount='{self.amount}',
            timestamp='{self.timestamp}',
            status='{self.status}',
            description='{self.description}'
        )>"""
