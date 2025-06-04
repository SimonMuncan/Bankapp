from typing import Generator
from unittest.mock import AsyncMock, MagicMock, ANY
import pytest

from app.crud.transaction import (
    transfer,
    log_transaction,
    get_all_transactions,
)
from app.schemas.transactions import TransactionIn


@pytest.mark.asyncio
async def test_transfer_success(mock_db: AsyncMock) -> None:
    sender_id, receiver_id, amount = 1, 2, 50.0

    result = await transfer(sender_id, receiver_id, amount, mock_db)

    assert result is True
    assert mock_db.execute.await_count == 2
    mock_db.commit.assert_awaited_once()
    mock_db.rollback.assert_not_awaited()


@pytest.mark.asyncio
async def test_transfer_failure_rolls_back(mock_db: AsyncMock) -> None:
    mock_db.execute.side_effect = [
        AsyncMock(),
        Exception("Database constraint violation"),
    ]
    sender_id, receiver_id, amount = 1, 2, 50.0

    result = await transfer(sender_id, receiver_id, amount, mock_db)

    assert result is False
    mock_db.rollback.assert_awaited_once()
    mock_db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_log_transaction_success(
    mock_db: AsyncMock, mock_transaction_in_schema: TransactionIn
) -> None:
    await log_transaction(mock_transaction_in_schema, mock_db)

    mock_db.execute.assert_awaited_once()
    mock_db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_all_transactions_success(
    mock_db: AsyncMock, mock_db_transaction_result: list[tuple]
) -> None:
    mock_db.execute.return_value.all.return_value = mock_db_transaction_result

    transactions = await get_all_transactions(
        query="",
        user_id=123,
        limit=10,
        offset=0,
        db=mock_db,
        transaction_type_filter="all",
    )

    mock_db.execute.assert_awaited_once()
    assert len(transactions) == 1
    assert transactions[0][1] == "Test Sender"
    assert transactions[0][2] == "Test Receiver"
