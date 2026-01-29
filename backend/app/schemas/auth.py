from pydantic import BaseModel, EmailStr

from app.schemas.user import UserRead


class TokenPair(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str


class TokenPayload(BaseModel):
    sub: str | None = None
    exp: int | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class LoginResponse(TokenPair):
    user: UserRead
