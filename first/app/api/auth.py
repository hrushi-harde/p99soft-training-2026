from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.jwt import decode_token
from app.db.session import get_db
from app.schemas.user import Message, TokenResponse, UserCreate, UserLogin, UserRead
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["auth"])


DbDep = Annotated[Session, Depends(get_db)]


REFRESH_COOKIE_NAME = "refresh_token"


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    # For local development, secure=False; set to True behind HTTPS.
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/")


@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: DbDep) -> UserRead:
    service = AuthService(db)
    return service.register_user(user_in)


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, response: Response, db: DbDep) -> TokenResponse:
    service = AuthService(db)
    token_response, refresh_token = service.authenticate_user(credentials)
    _set_refresh_cookie(response, refresh_token)
    return token_response


@router.post("/refresh", response_model=TokenResponse)
def refresh(
    response: Response,
    db: DbDep,
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_COOKIE_NAME),
) -> TokenResponse:
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

    service = AuthService(db)
    token_response, new_refresh_token = service.refresh_tokens(refresh_token)
    _set_refresh_cookie(response, new_refresh_token)
    return token_response


@router.post("/logout", response_model=Message)
def logout(
    response: Response,
    db: DbDep,
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_COOKIE_NAME),
) -> Message:
    if refresh_token:
        try:
            payload = decode_token(refresh_token)
            user_id = int(payload.get("sub"))
        except Exception:
            user_id = None

        if user_id is not None:
            service = AuthService(db)
            service.logout(user_id)

    _clear_refresh_cookie(response)
    return Message(message="Logged out")
