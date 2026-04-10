from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.jwt import decode_token
from app.db.session import get_db
from app.models.user import User


security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
) -> User:
    token: str | None = None

    # Prefer Authorization header
    if credentials is not None:
        token = credentials.credentials

    # Fallback: cookie named "access_token" if you decide to set it
    if not token:
        token_cookie = request.cookies.get("access_token")
        if token_cookie:
            token = token_cookie

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User inactive or not found")

    return user
