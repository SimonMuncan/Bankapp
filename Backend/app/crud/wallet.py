from sqlalchemy import select, update
from app.models.wallet import Wallets
from app.schemas.wallet import WalletOut
from sqlalchemy.ext.asyncio import AsyncSession


async def get_wallet(user_id: int, db: AsyncSession) -> WalletOut | None:
    stmt = select(Wallets).where(Wallets.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def add_into_wallet(
    user_id: int, amount: float, db: AsyncSession
) -> Wallets | None:
    stmt = (
        update(Wallets)
        .where(Wallets.user_id == user_id)
        .values(balance=Wallets.balance + amount)
        .returning(Wallets)
    )
    wallet_result = await db.execute(stmt)
    await db.commit()
    wallet_obj = wallet_result.scalar_one_or_none()

    return wallet_obj
