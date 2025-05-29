from pydantic import BaseModel


class TransactionIn(BaseModel):
    sender_id: int
    receiver_id: int
    amount: float
    status: bool
    description: str | None


class TransactionOut(TransactionIn):
    id: int
    timestamp: str


class TransactionName(TransactionOut):
    sender: str
    receiver: str
