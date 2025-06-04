from typing import Generator
from unittest.mock import AsyncMock, MagicMock, patch
import pytest
from pydantic import SecretStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.user import (
    create_new_user,
    authenticate_user,
    get_user,
    update_user,
)
from app.schemas.user import UserIn, UserUpdate


@pytest.fixture
def mock_db() -> AsyncMock:
    db_session = AsyncMock(spec=AsyncSession)
    db_session.flush = AsyncMock()
    db_session.commit = AsyncMock()
    return db_session


@pytest.mark.asyncio
async def test_get_user_found(mock_db: AsyncMock, mock_user_db_data: MagicMock):
    mock_result = MagicMock()
    mock_db.execute.return_value = mock_result
    mock_result.scalar_one_or_none.return_value = mock_user_db_data

    user = await get_user(user_id=mock_user_db_data.id, db=mock_db)

    mock_db.execute.assert_awaited_once()
    assert user is not None
    assert user == mock_user_db_data


@pytest.mark.asyncio
async def test_get_user_not_found(mock_db: AsyncMock) -> None:
    mock_result = MagicMock()
    mock_db.execute.return_value = mock_result
    mock_result.scalar_one_or_none.return_value = None

    user = await get_user(user_id=999, db=mock_db)

    mock_db.execute.assert_awaited_once()
    assert user is None


@pytest.mark.asyncio
async def test_create_new_user(
    mock_db: AsyncMock, mock_user_db_data: MagicMock, mock_user_input: UserIn
) -> None:
    mock_result = MagicMock()
    mock_db.execute.return_value = mock_result
    mock_result.scalar_one.return_value = mock_user_db_data

    new_user = await create_new_user(user=mock_user_input, db=mock_db)

    assert mock_db.execute.await_count == 2
    mock_db.flush.assert_awaited_once()
    mock_db.commit.assert_awaited_once()
    assert new_user is not None
    assert new_user.id == mock_user_db_data.id


@pytest.mark.asyncio
async def test_authenticate_user_success(mocker, mock_user_db_data: MagicMock) -> None:
    mocker.patch("app.crud.user.get_user_email", return_value=mock_user_db_data)
    mocker.patch("app.crud.user.verify_password", return_value=True)
    authenticated_user = await authenticate_user(
        email="test@example.com", password="correct_password", db=AsyncMock()
    )
    assert authenticated_user is not None
    assert authenticated_user.email == mock_user_db_data.email


@pytest.mark.asyncio
async def test_authenticate_user_not_found(mocker) -> None:
    mocker.patch("app.crud.user.get_user_email", return_value=None)
    mock_verify_password = mocker.patch("app.crud.user.verify_password")
    authenticated_user = await authenticate_user(
        email="nosuchuser@example.com", password="any_password", db=AsyncMock()
    )
    assert authenticated_user is None
    mock_verify_password.assert_not_called()


@pytest.mark.asyncio
async def test_authenticate_user_wrong_password(
    mocker, mock_user_db_data: MagicMock
) -> None:
    mocker.patch("app.crud.user.get_user_email", return_value=mock_user_db_data)
    mocker.patch("app.crud.user.verify_password", return_value=False)

    authenticated_user = await authenticate_user(
        email="test@example.com", password="wrong_password", db=AsyncMock()
    )
    assert authenticated_user is None


@pytest.mark.asyncio
async def test_update_user(mock_db: AsyncMock, mock_user_db_data: MagicMock):
    update_data = UserUpdate(name="Updated Name", email="updated@example.com")

    mock_updated_user = MagicMock()
    mock_updated_user.id = mock_user_db_data.id
    mock_updated_user.name = update_data.name
    mock_updated_user.email = update_data.email

    mock_result = MagicMock()
    mock_db.execute.return_value = mock_result
    mock_result.scalar_one_or_none.return_value = mock_updated_user

    updated_user = await update_user(
        user_id=mock_user_db_data.id, user_to_update=update_data, db=mock_db
    )

    mock_db.execute.assert_awaited_once()
    mock_db.commit.assert_awaited_once()
    assert updated_user is not None
    assert updated_user.name == "Updated Name"
    assert updated_user.email == "updated@example.com"
