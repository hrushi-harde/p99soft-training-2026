from typing import Optional
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core import jwt as jwt_utils
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserRead


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user_in: UserCreate) -> UserRead:
        existing = self.db.query(User).filter(User.email == user_in.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return UserRead.model_validate(user)

    def authenticate_user(self, credentials: UserLogin) -> tuple[TokenResponse, str]:
        user: Optional[User] = (
            self.db.query(User).filter(User.email == credentials.email).first()
        )
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        refresh_jti = str(uuid4())
        user.refresh_token_jti = refresh_jti
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        access_token = jwt_utils.create_access_token(subject=str(user.id))
        refresh_token = jwt_utils.create_refresh_token(subject=str(user.id), token_id=refresh_jti)

        return TokenResponse(access_token=access_token), refresh_token

    def refresh_tokens(self, refresh_token: str) -> tuple[TokenResponse, str]:
        try:
            payload = jwt_utils.decode_token(refresh_token)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

        user_id = payload.get("sub")
        jti = payload.get("jti")

        user: Optional[User] = self.db.query(User).filter(User.id == int(user_id)).first()
        if not user or not user.refresh_token_jti or user.refresh_token_jti != jti:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token no longer valid")

        new_jti = str(uuid4())
        user.refresh_token_jti = new_jti
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        access_token = jwt_utils.create_access_token(subject=str(user.id))
        new_refresh_token = jwt_utils.create_refresh_token(subject=str(user.id), token_id=new_jti)

        return TokenResponse(access_token=access_token), new_refresh_token

    def logout(self, user_id: int) -> None:
        user: Optional[User] = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return
        user.refresh_token_jti = None
        self.db.add(user)
        self.db.commit()
