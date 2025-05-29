from pydantic import BaseModel, EmailStr, Field, SecretStr


MIN_PASSWORD_LENGTH = 8


class UserIn(BaseModel):
    name: str
    email: EmailStr
    password: SecretStr = Field(
        min_length=MIN_PASSWORD_LENGTH,
        description=f"Password must be at least {MIN_PASSWORD_LENGTH}"
        " characters long and include at least one number and"
        " one special character.",
    )


class UserOut(UserIn):
    id: int


class CurrentUser(BaseModel):
    id: int
    email: str
    name: str


class OAuth2TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int | None = None
    refresh_token: str | None = None
    scope: str | None = None
