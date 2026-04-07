from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt

from app.core.config import get_settings


settings = get_settings()

def create_access_token(subject: str, extra_claims: Optional[Dict[str, Any]] = None) -> str:
    if extra_claims is None:
        extra_claims = {}
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode: Dict[str, Any] = {"sub": subject, "exp": expire, "type": "access", **extra_claims}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(subject: str, token_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    to_encode: Dict[str, Any] = {
        "sub": subject,
        "exp": expire,
        "type": "refresh",
        "jti": token_id,
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
