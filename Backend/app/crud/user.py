from sqlalchemy import insert, select, update
from app.models.user import Users
from app.models.wallet import Wallets
from app.schemas.user import UserIn, UserUpdate

from sqlalchemy import insert, select
from app.models.user import Users
from app.models.wallet import Wallets
from app.schemas.user import UserIn
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def create_new_user(user: UserIn, db: AsyncSession) -> Users:
    hashed_password_val = get_password_hash(user.password.get_secret_value())
    query = (
        insert(Users)
        .values(email=user.email, name=user.name, hashed_password=hashed_password_val)
        .returning(Users)
    )
    user_result = await db.execute(query)
    await db.flush()
    user_obj = user_result.scalar_one()

    query1 = insert(Wallets).values(user_id=user_obj.id, balance=0)
    await db.execute(query1)
    await db.commit()

    return user_obj


async def authenticate_user(
    email: str, password: str, db: AsyncSession
) -> Users | None:
    user = await get_user_email(email, db)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def get_user_email(user_email: str, db: AsyncSession) -> Users | None:
    query = select(Users).where(Users.email == user_email)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_user(user_id: int, db: AsyncSession) -> Users | None:
    stmt = select(Users).where(Users.id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def update_user(
    user_id: int, user_to_update: UserUpdate, db: AsyncSession
) -> Users | None:
    update_values = {}
    provided_data = user_to_update.model_dump(exclude_unset=True)

    if "name" in provided_data:
        update_values["name"] = provided_data["name"]

    if "email" in provided_data:
        update_values["email"] = provided_data["email"]

    if user_to_update.password is not None:
        password_value = user_to_update.password.get_secret_value()
        if password_value:

            update_values["hashed_password"] = get_password_hash(password_value)

    stmt = (
        update(Users)
        .where(Users.id == user_id)
        .values(**update_values)
        .returning(Users)
    )

    result = await db.execute(stmt)
    await db.commit()
    return result.scalar_one_or_none()

