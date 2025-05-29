from fastapi import APIRouter, HTTPException
from app.crud.transaction import get_all_transactions, log_transaction, transfer
from app.crud.wallet import get_wallet
from app.crud.user import get_user
from app.schemas.transactions import TransactionIn, TransactionName
from app.dependancies.database import db_dependancy
from app.dependancies.auth import current_user

router_transaction = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


@router_transaction.get("/{user_id}")
async def get_transactions(
    db: db_dependancy,
    current_user: current_user,
    limit: int = 10,
    offset: int = 0,
) -> list[TransactionName]:
    transactions_list = await get_all_transactions(current_user.id, limit, offset, db)
    if not transactions_list:
        return []

    formatted_transactions = []
    for transaction, sender_name, receiver_name in transactions_list:
        formatted_transactions.append(
            TransactionName(
                id=transaction.id,
                timestamp=str(transaction.timestamp),
                sender_id=transaction.sender_id,
                receiver_id=transaction.receiver_id,
                amount=transaction.amount,
                status=transaction.status,
                description=transaction.description,
                sender=sender_name,
                receiver=receiver_name,
            )
        )
    return formatted_transactions


@router_transaction.patch("/transfer-money", status_code=200)
async def transfer_money(
    reciever_user_id: int, amount: float, db: db_dependancy, current_user: current_user
) -> dict[str, str]:
    reciever_user = await get_user(reciever_user_id, db)
    if not reciever_user:
        raise HTTPException(status_code=404, detail="User not found")
    sender_wallet = await get_wallet(current_user.id, db)
    trans = TransactionIn(
        sender_id=current_user.id,
        receiver_id=reciever_user_id,
        amount=amount,
        status=True,
        description="",
    )
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount!")
    if not sender_wallet:
        raise HTTPException(status_code=404, detail="Not found wallet!")
    if sender_wallet.balance < amount:
        trans.status = False
        trans.description = "Not enough balance!"
        await log_transaction(trans, db)
        raise HTTPException(status_code=409, detail="Not enough balance")
    if current_user.id == reciever_user_id:
        raise HTTPException(status_code=400, detail="Cannot transfer to self")
    transfer_result = await transfer(current_user.id, reciever_user_id, amount, db)
    if not transfer_result:
        trans.status = False
        trans.description = "Failed!"
        await log_transaction(trans, db)
        raise HTTPException(status_code=400, detail="Transaction failed")
    await log_transaction(trans, db)
    return {"detail": "Transfer successful"}
