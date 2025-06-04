import pytest
from httpx import AsyncClient
from app.schemas.user import CurrentUser
from app.schemas.wallet import WalletOut


@pytest.mark.asyncio
async def test_deposit_success(
    client: AsyncClient, mocker, mock_updated_wallet_data: WalletOut
) -> None:
    mocker.patch(
        "app.routers.wallet.add_into_wallet", return_value=mock_updated_wallet_data
    )

    response = await client.patch("/wallet/deposit/999", params={"amount": 50})

    assert response.status_code == 200
    assert response.json() == mock_updated_wallet_data.model_dump()


@pytest.mark.asyncio
async def test_deposit_wallet_not_found(client: AsyncClient, mocker) -> None:
    mocker.patch("app.routers.wallet.add_into_wallet", return_value=None)
    response = await client.patch("/wallet/deposit/999", params={"amount": 50})
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found wallet!"}


@pytest.mark.asyncio
async def test_get_user_wallet_success(
    client: AsyncClient,
    mocker,
    mock_user_data: CurrentUser,
    mock_wallet_data: WalletOut,
) -> None:
    mocker.patch("app.routers.wallet.get_wallet", return_value=mock_wallet_data)
    mocker.patch("app.routers.wallet.get_user", return_value=mock_user_data)
    response = await client.get(f"/wallet/{mock_user_data.id}")
    assert response.status_code == 200
    expected_data = {
        "Wallet": mock_wallet_data.model_dump(),
        "User": mock_user_data.model_dump(),
    }
    assert response.json() == expected_data


@pytest.mark.asyncio
async def test_get_user_wallet_fails_if_wallet_not_found(
    client: AsyncClient, mocker, mock_user_data: CurrentUser
) -> None:
    mocker.patch("app.routers.wallet.get_wallet", return_value=None)
    mocker.patch("app.routers.wallet.get_user", return_value=mock_user_data)
    response = await client.get(f"/wallet/{mock_user_data.id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found wallet!"}


@pytest.mark.asyncio
async def test_get_user_wallet_fails_if_user_not_found(
    client: AsyncClient, mocker, mock_wallet_data: WalletOut
) -> None:
    mocker.patch("app.routers.wallet.get_wallet", return_value=mock_wallet_data)
    mocker.patch("app.routers.wallet.get_user", return_value=None)
    response = await client.get("/wallet/123")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found user!"}
