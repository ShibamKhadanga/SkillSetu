from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid, logging

from config.db import get_db
from models.models import User, StudentProfile, RecruiterProfile
from utils.jwt_utils import hash_password, verify_password, create_access_token

router = APIRouter()
logger = logging.getLogger(__name__)


# ── Schemas ────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name:     str
    username: str
    email:    EmailStr
    phone:    Optional[str] = None
    password: str
    role:     str            # "student" | "recruiter"
    company:  Optional[str] = None


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


# ── Helper ─────────────────────────────────────────────
def user_dict(user: User) -> dict:
    return {
        "id":         user.id,
        "name":       user.name,
        "username":   user.username,
        "email":      user.email,
        "phone":      user.phone,
        "role":       user.role,
        "avatar_url": user.avatar_url,
    }


# ── Routes ─────────────────────────────────────────────

@router.post("/register")
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Duplicate checks
    r = await db.execute(select(User).where(User.email == body.email))
    if r.scalar_one_or_none():
        raise HTTPException(400, "Email already registered")

    r = await db.execute(select(User).where(User.username == body.username.lower()))
    if r.scalar_one_or_none():
        raise HTTPException(400, "Username already taken")

    if body.role not in ("student", "recruiter"):
        raise HTTPException(400, "role must be 'student' or 'recruiter'")

    user = User(
        id            = str(uuid.uuid4()),
        name          = body.name,
        username      = body.username.lower(),
        email         = body.email,
        phone         = body.phone,
        password_hash = hash_password(body.password),
        role          = body.role,
    )
    db.add(user)
    await db.flush()   # assigns user.id before we use it below

    if body.role == "student":
        db.add(StudentProfile(
            id=str(uuid.uuid4()), user_id=user.id,
            skills=[], interests=[], education=[],
            projects=[], achievements=[], certificates=[],
            uploaded_documents=[],
        ))
    else:
        db.add(RecruiterProfile(
            id=str(uuid.uuid4()), user_id=user.id,
            company=body.company or body.name,
        ))

    await db.commit()
    token = create_access_token({"sub": user.id, "role": user.role})
    logger.info(f"✅ Registered: {user.email} ({user.role})")
    return {
        "success": True,
        "message": "Welcome to SkillSetu! 🎉",
        "data": {"user": user_dict(user), "token": token},
    }


@router.post("/login")
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    r = await db.execute(select(User).where(User.email == body.email))
    user = r.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(403, "Account is deactivated")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "success": True,
        "message": f"Welcome back, {user.name}! 👋",
        "data": {"user": user_dict(user), "token": token},
    }


@router.get("/me")
async def me(db: AsyncSession = Depends(get_db)):
    return {"message": "Send Authorization: Bearer <token> header"}
