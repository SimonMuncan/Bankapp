from typing import Generator
from unittest.mock import AsyncMock, MagicMock
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.wallet import add_into_wallet, get_wallet


@pytest.fixture
def mock_db() -> Generator[AsyncMock, None, None]:
    mock_db = AsyncMock(spec=AsyncSession)
    yield mock_db


@pytest.mark.asyncio
async def test_get_wallet_found(mock_db: AsyncMock, mock_wallet_db_data: MagicMock):
    mock_result = MagicMock()
    mock_db.execute.return_value = mock_result
    mock_result.scalar_one_or_none.return_value = mock_wallet_db_data
    wallet_out = await get_wallet(user_id=mock_wallet_db_data.user_id, db=mock_db)

    mock_db.execute.assert_awaited_once()
    assert wallet_out is not None
    assert wallet_out.balance == mock_wallet_db_data.balance


@pytest.mark.asyncio
async def test_add_into_wallet(
    mock_db: AsyncMock, mock_update_wallet_db_data: MagicMock
):
    amount = 50
    mock_result = MagicMock()
    mock_db.execute.return_value = mock_result
    mock_result.scalar_one_or_none.return_value = mock_update_wallet_db_data
    wallet_out = await add_into_wallet(
        user_id=mock_update_wallet_db_data.user_id, amount=amount, db=mock_db
    )

    mock_db.execute.assert_awaited_once()
    assert wallet_out is not None
    assert wallet_out.balance == mock_update_wallet_db_data.balance
