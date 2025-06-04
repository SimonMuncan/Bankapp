from pydantic import BaseModel, EmailStr, Field, SecretStr


class UserIn(BaseModel):
    name: str
    email: EmailStr
    password: SecretStr


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


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    password: SecretStr | None = None
