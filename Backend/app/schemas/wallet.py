from pydantic import BaseModel


class WalletOut(BaseModel):
    id: int
    balance: float
