from fastapi import APIRouter, HTTPException
from crud.user import get_user
from schemas.user import CurrentUser
from schemas.wallet import WalletOut
from crud.wallet import add_into_wallet, get_wallet
from dependancies.database import db_dependancy
from dependancies.auth import current_user


router_wallet = APIRouter(
    prefix="/wallet",
    tags=["My Wallet"],
)


@router_wallet.patch("/deposit/{user_id}")
async def deposit_into(
    amount: float, db: db_dependancy, current_user: current_user
) -> WalletOut:
    wallet_balance = await add_into_wallet(current_user.id, amount, db)
    if not wallet_balance:
        raise HTTPException(status_code=404, detail="Not found wallet!")
    return wallet_balance


@router_wallet.get("/{user_id}")
async def get_user_wallet(
    user_id: int, db: db_dependancy, current_user: current_user
) -> dict:
    wallet = await get_wallet(user_id, db)
    user = await get_user(user_id, db)
    if not wallet:
        raise HTTPException(status_code=404, detail="Not found wallet!")
    if not user:
        raise HTTPException(status_code=404, detail="Not found user!")
    return {
        "Wallet": WalletOut(**wallet.__dict__),
        "User": CurrentUser(**user.__dict__),
    }
