from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_auth_service
from app.application.services.auth import AuthService
from app.infrastructure.db.session import get_db_session
from app.infrastructure.security.auth import decode_token
from app.schemas.auth import LoginRequest, LoginResponse, RefreshRequest, TokenPair
from app.schemas.user import UserCreate, UserRead

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    payload: UserCreate,
    service: AuthService = Depends(get_auth_service),
    session: AsyncSession = Depends(get_db_session),
) -> UserRead:
    try:
        user = await service.register_user(
            email=payload.email, password=payload.password, full_name=payload.full_name
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    await session.commit()
    return UserRead(id=user.id or 0, email=user.email, full_name=user.full_name, created_at=user.created_at)


@router.post("/login", response_model=LoginResponse)
async def login(
    payload: LoginRequest,
    service: AuthService = Depends(get_auth_service),
) -> LoginResponse:
    try:
        access_token, user = await service.authenticate(email=payload.email, password=payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    refresh_token = await service.issue_refresh_token(user_id=str(user.id))
    user_read = UserRead(
        id=user.id or 0,
        email=user.email,
        full_name=user.full_name,
        created_at=user.created_at,
    )
    return LoginResponse(access_token=access_token, refresh_token=refresh_token, user=user_read)


@router.post("/refresh", response_model=TokenPair)
async def refresh_token(
    payload: RefreshRequest,
    service: AuthService = Depends(get_auth_service),
) -> TokenPair:
    try:
        decoded = decode_token(payload.refresh_token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    subject = decoded.get("sub")
    if subject is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    access_token = await service.issue_access_token(user_id=subject)
    refresh_token = await service.issue_refresh_token(user_id=subject)
    return TokenPair(access_token=access_token, refresh_token=refresh_token)
