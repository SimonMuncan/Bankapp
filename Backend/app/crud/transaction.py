from decimal import Decimal
from sqlalchemy import desc, insert, select, update
from app.models.user import Users
from app.models.transaction import Transactions
from app.schemas.transactions import TransactionIn
from app.models.wallet import Wallets
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased


async def transfer(sender_id: int, reciever_id: int, amount: float, db: AsyncSession) -> bool:
    try:
        stmt1 = (
            update(Wallets)
            .where(Wallets.user_id == sender_id)
            .values(balance=Wallets.balance - Decimal(str(amount)))
        )
        await db.execute(stmt1)
        stmt2 = (
            update(Wallets)
            .where(Wallets.user_id == reciever_id)
            .values(balance=Wallets.balance + Decimal(str(amount)))
        )
        await db.execute(stmt2)
        await db.commit()
    except Exception:
        await db.rollback()
        return False
    return True


async def log_transaction(transaction_data: TransactionIn, db: AsyncSession) -> None:
    stmt = insert(Transactions).values(
        sender_id=transaction_data.sender_id,
        receiver_id=transaction_data.receiver_id,
        amount=transaction_data.amount,
        status=transaction_data.status,
        description=transaction_data.description,
    )
    await db.execute(stmt)
    await db.commit()


async def get_all_transactions(
    query: str, user_id: int, limit: int, offset: int, db: AsyncSession
) -> list[tuple[Transactions, str, str]]:
    Sender = aliased(Users)
    Receiver = aliased(Users)
    base_stmt = (
        select(
            Transactions,
            Sender.name.label("sender_name"),
            Receiver.name.label("receiver_name"),
        )
        .join(Sender, Sender.id == Transactions.sender_id)
        .join(Receiver, Receiver.id == Transactions.receiver_id)
        .where(
            (Transactions.receiver_id == user_id) | (Transactions.sender_id == user_id)
        )
    )

    if not query:
        final_stmt = (
            base_stmt
            .order_by(desc(Transactions.timestamp))
            .limit(limit=limit)
            .offset(offset=offset)
        )
    else:
        final_stmt = (
            base_stmt
            .where(
                (Sender.name.icontains(query)) | (Receiver.name.icontains(query))
            )
            .order_by(desc(Transactions.timestamp))
            .limit(limit=limit)
            .offset(offset=offset)
        )
    
    result = await db.execute(final_stmt)
    return [tuple(row) for row in result.all()]
