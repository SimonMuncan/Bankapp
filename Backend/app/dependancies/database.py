from typing import Annotated, AsyncGenerator
from fastapi import Depends
from app.core.database import async_session
from sqlalchemy.ext.asyncio import AsyncSession


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as a_session:
        yield a_session


db_dependancy = Annotated[AsyncSession, Depends(get_session)]
