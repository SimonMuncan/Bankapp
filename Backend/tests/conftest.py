from pydantic import SecretStr
import pytest
from httpx import ASGITransport, AsyncClient
from datetime import datetime, timedelta
from typing import AsyncGenerator, Generator
from unittest import mock
from app.schemas.transactions import TransactionIn
from app.schemas.wallet import WalletOut
from app.services.authentification import create_access_token
from app.main import app
from app.dependancies.database import get_session
from app.schemas.user import CurrentUser, UserIn
from sqlalchemy.ext.asyncio import AsyncSession


# database mock fixtures


@pytest.fixture(autouse=True)
def mock_jwt_config() -> Generator[None, None, None]:
    with mock.patch.multiple(
        "app.core.auth",
        OAUTH_SECRET_KEY="test_secret_key",
    ):
        yield


@pytest.fixture
def mock_token(mock_user_data) -> Generator[str, None, None]:
    yield create_access_token(
        mock_user_data.email,
        mock_user_data.name,
        mock_user_data.id,
        timedelta(minutes=30),
    )


@pytest.fixture
async def client(
    mocker, mock_user_data: CurrentUser, mock_token: str
) -> AsyncGenerator[AsyncClient, None]:
    mocker.patch(
        "app.services.authentification.get_current_user", return_value=mock_user_data
    )

    async def override_get_session():
        yield None

    app.dependency_overrides[get_session] = override_get_session

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        ac.headers.update({"Authorization": f"Bearer {mock_token}"})
        yield ac

    app.dependency_overrides = {}


# user data fixture


@pytest.fixture
def mock_user_data() -> Generator[CurrentUser, None, None]:
    yield CurrentUser(id=123, email="test@example.com", name="Test User")


@pytest.fixture
def mock_user_db_data() -> mock.MagicMock:
    mock_user = mock.MagicMock()
    mock_user.id = 123
    mock_user.email = "test@example.com"
    mock_user.name = "Test User"
    mock_user.hashed_password = "hashed_password_string"
    return mock_user


@pytest.fixture
def mock_user_input() -> Generator[UserIn, None, None]:
    yield UserIn(
        email="newuser@example.com",
        name="New User",
        password=SecretStr("a_strong_password"),
    )


# wallet fixtures


@pytest.fixture
def mock_wallet_db_data() -> Generator[mock.MagicMock, None, None]:
    mock_wallet = mock.MagicMock()
    mock_wallet.id = 1
    mock_wallet.user_id = 123
    mock_wallet.balance = 100.50
    yield mock_wallet


@pytest.fixture
def mock_update_wallet_db_data() -> Generator[mock.MagicMock, None, None]:
    mock_wallet = mock.MagicMock()
    mock_wallet.id = 1
    mock_wallet.user_id = 123
    mock_wallet.balance = 150.50
    yield mock_wallet


@pytest.fixture
def mock_wallet_data() -> Generator[WalletOut, None, None]:
    yield WalletOut(id=1, balance=100.50)


@pytest.fixture
def mock_updated_wallet_data() -> Generator[WalletOut, None, None]:
    yield WalletOut(id=1, balance=150.50)


# fixtures for transactions


@pytest.fixture
def mock_transaction_obj(
    mock_user_data: CurrentUser, mock_transaction_timestamp: datetime
) -> mock.MagicMock:
    mock_transaction = mock.MagicMock()
    mock_transaction.id = 1
    mock_transaction.timestamp = mock_transaction_timestamp
    mock_transaction.sender_id = mock_user_data.id
    mock_transaction.receiver_id = 456
    mock_transaction.amount = 150.75
    mock_transaction.status = True
    mock_transaction.description = "Test transaction description"
    return mock_transaction


@pytest.fixture
def default_receiver_user_id() -> int:
    return 456


@pytest.fixture
def default_transaction_amount() -> float:
    return 100.0


@pytest.fixture
def default_search_query() -> str:
    return "payment"


@pytest.fixture
def mock_transaction_timestamp() -> datetime:
    return datetime(2023, 10, 26, 10, 30, 0)


# transactions crud fixtures


@pytest.fixture
def mock_db() -> Generator[mock.AsyncMock, None, None]:
    db_session = mock.AsyncMock(spec=AsyncSession)
    db_session.commit = mock.AsyncMock()
    db_session.rollback = mock.AsyncMock()

    mock_result = mock.MagicMock()
    db_session.execute = mock.AsyncMock(return_value=mock_result)

    yield db_session


@pytest.fixture
def mock_transaction_in_schema() -> Generator[TransactionIn, None, None]:
    yield TransactionIn(
        sender_id=123,
        receiver_id=456,
        amount=100.0,
        status=True,
        description="Test transaction log",
    )


@pytest.fixture
def mock_db_transaction_result() -> Generator[list[tuple], None, None]:
    mock_transaction_obj = mock.MagicMock()
    mock_transaction_obj.id = 1
    mock_transaction_obj.amount = 100.0
    sender_name = "Test Sender"
    receiver_name = "Test Receiver"

    yield [(mock_transaction_obj, sender_name, receiver_name)]
