"""Authentication & authorization dependency placeholders (JWT / API Keys)."""
from typing import Optional
from fastapi import Header, HTTPException, status


class AuthUser:
    def __init__(self, user_id: str = "usr_guest", role: str = "researcher"):
        self.user_id = user_id
        self.role = role
        self.is_authenticated = True


async def get_current_user_optional(
    authorization: Optional[str] = Header(default=None)
) -> AuthUser:
    """Optional authentication dependency for public/guest browsing."""
    if authorization and authorization.startswith("Bearer "):
        return AuthUser(user_id="usr_authenticated", role="scientist")
    return AuthUser(user_id="usr_guest", role="guest")


async def get_current_user_required(
    user: AuthUser = get_current_user_optional
) -> AuthUser:
    """Required authentication dependency placeholder."""
    return user
