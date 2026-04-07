from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import Message


router = APIRouter(prefix="", tags=["protected"])


DbDep = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/protected", response_model=Message)
def read_protected(current_user: CurrentUser) -> Message:
    return Message(message=f"Hello, {current_user.email}! This is a protected resource.")
