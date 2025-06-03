from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.services.authentification import create_access_token
from app.crud.user import authenticate_user, create_new_user, get_user_email, update_user
from app.schemas.user import OAuth2TokenResponse, UserIn, UserUpdate
from app.dependancies.database import db_dependancy
from starlette import status
from app.dependancies.auth import current_user


router_user = APIRouter(
    prefix="/auth",
    tags=["User Authentification"],
)


@router_user.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserIn, db: db_dependancy) -> dict[str, str]:
    check_user = await get_user_email(user.email, db)
    if check_user:
        raise HTTPException(status_code=400, detail="Email already exist")
    user = await create_new_user(user, db)
    if user:
        return {"detail": "Successful registration"}
    else:
        return {"detail": "Failed registration"}


@router_user.post("/token", response_model=OAuth2TokenResponse)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependancy
) -> OAuth2TokenResponse:
    user = await authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate user {form_data.username}.",
        )
    exp_time = timedelta(minutes=30)
    token = create_access_token(user.email, user.name, user.id, exp_time)
    return OAuth2TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=int(exp_time.total_seconds()),
        refresh_token=None,
        scope="read write",
    )


@router_user.patch("/profile")
async def update_users(
    user_to_update: UserUpdate, 
    db: db_dependancy, 
    current_user: current_user,
) -> dict[str,str]:
    updated_user = await update_user(current_user.id, user_to_update, db)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found or no update performed")    
    return {"detail": "Successful profile updated!"}
