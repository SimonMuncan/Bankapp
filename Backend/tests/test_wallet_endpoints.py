from httpx import ASGITransport
import pytest
from httpx import AsyncClient
from app.main import app
from app.dependancies.database import get_session
from app.schemas.user import CurrentUser
from app.schemas.wallet import WalletOut


@pytest.fixture
def mock_user_data() -> CurrentUser:
    return CurrentUser(id=123, email="test@example.com", name="Test User")

@pytest.fixture
def mock_wallet_data() -> WalletOut:
    return WalletOut(id=1, balance=100.50)

@pytest.fixture
def mock_updated_wallet_data() -> WalletOut:
    return WalletOut(id=1, balance=150.50)


@pytest.fixture
async def client(mocker, mock_user_data: CurrentUser):
    mocker.patch(
        'app.services.authentification.get_current_user',
        return_value=mock_user_data
    )
    
    async def override_get_session():
        yield None
    
    app.dependency_overrides[get_session] = override_get_session

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        ac.headers.update({"Authorization": "Bearer fake-token"})
        yield ac

    app.dependency_overrides = {}

@pytest.mark.asyncio
async def test_deposit_success(client: AsyncClient, mocker, mock_updated_wallet_data: WalletOut):
    mocker.patch(
        'app.routers.wallet.add_into_wallet',
        return_value=mock_updated_wallet_data
    )
    
    response = await client.patch("/wallet/deposit/999", params={"amount": 50})
    
    assert response.status_code == 200
    assert response.json() == mock_updated_wallet_data.dict()

@pytest.mark.asyncio
async def test_deposit_wallet_not_found(client: AsyncClient, mocker):
    mocker.patch('app.routers.wallet.add_into_wallet', return_value=None)
    response = await client.patch("/wallet/deposit/999", params={"amount": 50})
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found wallet!"}


@pytest.mark.asyncio
async def test_get_user_wallet_success(client: AsyncClient, mocker, mock_user_data: CurrentUser, mock_wallet_data: WalletOut):
    mocker.patch('app.routers.wallet.get_wallet', return_value=mock_wallet_data)
    mocker.patch('app.routers.wallet.get_user', return_value=mock_user_data)
    response = await client.get(f"/wallet/{mock_user_data.id}")
    assert response.status_code == 200
    expected_data = {
        "Wallet": mock_wallet_data.dict(),
        "User": mock_user_data.dict(),
    }
    assert response.json() == expected_data


@pytest.mark.asyncio
async def test_get_user_wallet_fails_if_wallet_not_found(client: AsyncClient, mocker, mock_user_data: CurrentUser):
    mocker.patch('app.routers.wallet.get_wallet', return_value=None)
    mocker.patch('app.routers.wallet.get_user', return_value=mock_user_data)
    response = await client.get(f"/wallet/{mock_user_data.id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found wallet!"}


@pytest.mark.asyncio
async def test_get_user_wallet_fails_if_user_not_found(client: AsyncClient, mocker, mock_wallet_data: WalletOut):
    mocker.patch('app.routers.wallet.get_wallet', return_value=mock_wallet_data)
    mocker.patch('app.routers.wallet.get_user', return_value=None)
    response = await client.get("/wallet/123")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found user!"}