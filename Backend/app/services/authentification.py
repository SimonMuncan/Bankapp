from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, Request
from starlette import status
from starlette.responses import Response, JSONResponse
from schemas.user import CurrentUser
from core.auth import oauth2_bearer, OAUTH_ALGORITHM, OAUTH_SECRET_KEY


def create_access_token(
    email: str, name: str, user_id: int, expires_delta: timedelta
) -> str:
    payload = {
        "email": email,
        "sub": name,
        "id": str(user_id),
        "exp": datetime.now(timezone.utc) + expires_delta,
    }
    return jwt.encode(payload, OAUTH_SECRET_KEY, algorithm=OAUTH_ALGORITHM)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_bearer)],
) -> CurrentUser:
    try:
        payload = jwt.decode(token, OAUTH_SECRET_KEY, algorithms=OAUTH_ALGORITHM)
        email = payload["email"]
        user_id = payload["id"]
        name = payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    except KeyError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token payload: {e.args[0]} missing",
        )
    return CurrentUser(id=user_id, email=email, name=name)


async def auth_middleware(request: Request, call_next) -> Response:
    public_routes = {
        "/",
        "/token",
        "/auth/token",
        "/auth",
        "/docs",
        "/openapi.json",
        "/auth/register",
    }

    if request.url.path in public_routes:
        return await call_next(request)

    authorization = request.headers.get("Authorization")
    if not authorization:
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid or missing authorization token"},
        )
    token = authorization.split(" ")[-1]
    user = await get_current_user(token)
    request.state.user = user
    return await call_next(request)
