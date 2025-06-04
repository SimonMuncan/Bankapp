from unittest import mock
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient
import pytest
from datetime import datetime
from app.schemas.user import CurrentUser


@pytest.mark.asyncio
async def test_transfer_money_success(
    client: AsyncClient,
    mocker,
    default_receiver_user_id: int,
    default_transaction_amount: float,
) -> None:
    mocker.patch("app.routers.transaction.get_user", return_value=MagicMock())
    mocker.patch(
        "app.routers.transaction.get_wallet", return_value=MagicMock(balance=500.0)
    )
    mocker.patch("app.routers.transaction.transfer", return_value=True)
    mock_log_transaction = mocker.patch(
        "app.routers.transaction.log_transaction", return_value=AsyncMock()
    )

    response = await client.patch(
        "/transactions/transfer-money",
        params={
            "reciever_user_id": default_receiver_user_id,
            "amount": default_transaction_amount,
        },
    )

    assert response.status_code == 200
    assert response.json() == {"detail": "Transfer successful"}
    mock_log_transaction.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_transactions_with_query(
    client: AsyncClient,
    mocker,
    mock_user_data: CurrentUser,
    mock_transaction_obj: MagicMock,
    default_search_query: str,
) -> None:
    mock_transactions_list = [(mock_transaction_obj, "Sender Name", "Receiver Name")]
    mocker.patch(
        "app.routers.transaction.get_all_transactions",
        return_value=mock_transactions_list,
    )

    response = await client.get(
        f"/transactions/{mock_user_data.id}", params={"query": default_search_query}
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data[0]["description"] == mock_transaction_obj.description
