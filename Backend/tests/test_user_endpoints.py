from unittest.mock import MagicMock
import pytest
from httpx import AsyncClient
from app.schemas.user import CurrentUser


@pytest.mark.asyncio
async def test_register_user_success(client: AsyncClient, mocker) -> None:
    mocker.patch("app.routers.user.get_user_email", return_value=None)
    mock_created_user = mocker.patch(
        "app.routers.user.create_new_user", return_value=MagicMock()
    )

    register_payload = {
        "email": "new.user@example.com",
        "name": "New User",
        "password": "a-very-secure-password",
    }

    response = await client.post("/auth/register", json=register_payload)

    assert response.status_code == 201
    assert response.json() == {"detail": "Successful registration"}
    mock_created_user.assert_awaited_once()


@pytest.mark.asyncio
async def test_register_user_email_exists(
    client: AsyncClient, mocker, mock_user_data: CurrentUser
) -> None:
    mocker.patch("app.routers.user.get_user_email", return_value=mock_user_data)
    mock_create_new_user = mocker.patch("app.routers.user.create_new_user")
    register_payload = {
        "email": mock_user_data.email,
        "name": "Another Name",
        "password": "password123",
    }

    response = await client.post("/auth/register", json=register_payload)

    assert response.status_code == 400
    assert response.json() == {"detail": "Email already exist"}
    mock_create_new_user.assert_not_awaited()


@pytest.mark.asyncio
async def test_login_for_access_token_success(
    client: AsyncClient, mocker, mock_user_data: CurrentUser
) -> None:
    mocker.patch("app.routers.user.authenticate_user", return_value=mock_user_data)
    mocker.patch("app.routers.user.create_access_token", return_value="fake-jwt-token")
    login_form_data = {
        "username": mock_user_data.email,
        "password": "correct_password",
    }
    response = await client.post("/auth/token", data=login_form_data)

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["access_token"] == "fake-jwt-token"
    assert response_data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_for_access_token_failure(client: AsyncClient, mocker) -> None:
    mocker.patch("app.routers.user.authenticate_user", return_value=None)
    login_form_data = {"username": "test@example.com", "password": "wrong_password"}
    response = await client.post("/auth/token", data=login_form_data)

    assert response.status_code == 401
    assert "Could not validate user" in response.json()["detail"]


@pytest.mark.asyncio
async def test_update_profile_success(client: AsyncClient, mocker) -> None:
    mock_update_user = mocker.patch(
        "app.routers.user.update_user", return_value=MagicMock()
    )
    update_payload = {"name": "A New Name"}
    response = await client.patch("/auth/profile", json=update_payload)

    assert response.status_code == 200
    assert response.json() == {"detail": "Successful profile updated!"}
    mock_update_user.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_profile_not_found(client: AsyncClient, mocker) -> None:
    mocker.patch("app.routers.user.update_user", return_value=None)

    update_payload = {"name": "A New Name"}

    response = await client.patch("/auth/profile", json=update_payload)

    assert response.status_code == 404
    assert response.json() == {"detail": "User not found or no update performed"}
