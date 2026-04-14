"""
Add these routes to your backend.
1. Copy feedback_routes.py to backend/routes/
2. Add to main.py:
      from routes.feedback_routes import router as feedback_router
      app.include_router(feedback_router, prefix="/feedback", tags=["Feedback"])
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, Column, String, Integer, Text, DateTime, Boolean
from datetime import datetime
import uuid

from config.db import get_db, Base
from models.models import User
from utils.jwt_utils import get_current_user

router = APIRouter()


# ── Model (add this to models/models.py) ────────────────────
# Copy this class into your models/models.py file

"""
class Feedback(Base):
    __tablename__ = "feedbacks"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id    = Column(String, nullable=False)
    user_name  = Column(String(100), nullable=False)
    user_role  = Column(String(20), nullable=False)
    rating     = Column(Integer, nullable=False)   # 1-5 stars
    message    = Column(Text, nullable=False)
    is_public  = Column(Boolean, default=True)     # Show on landing page?
    created_at = Column(DateTime, default=datetime.utcnow)
"""


# ── Schemas ──────────────────────────────────────────────────
class FeedbackRequest(BaseModel):
    rating:    int          # 1-5
    message:   str
    is_public: bool = True


# ── Routes ───────────────────────────────────────────────────

@router.post("/submit")
async def submit_feedback(
    body:         FeedbackRequest,
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    if not 1 <= body.rating <= 5:
        raise HTTPException(400, "Rating must be between 1 and 5")
    if len(body.message.strip()) < 10:
        raise HTTPException(400, "Please write at least 10 characters")

    from models.models import Feedback
    fb = Feedback(
        user_id   = current_user.id,
        user_name = current_user.name,
        user_role = current_user.role,
        rating    = body.rating,
        message   = body.message.strip(),
        is_public = body.is_public,
    )
    db.add(fb)
    await db.commit()
    return {"success": True, "message": "Thank you for your feedback! 🙏"}


@router.get("/public")
async def public_feedback(db: AsyncSession = Depends(get_db)):
    """Returns top public feedback for the landing page testimonials."""
    from models.models import Feedback
    result = await db.execute(
        select(Feedback)
        .where(Feedback.is_public == True)
        .order_by(Feedback.created_at.desc())
        .limit(6)
    )
    items = result.scalars().all()
    return {"success": True, "data": [
        {
            "id":        f.id,
            "name":      f.user_name,
            "role":      f.user_role,
            "rating":    f.rating,
            "message":   f.message,
            "date":      f.created_at.strftime("%b %Y"),
        }
        for f in items
    ]}


@router.delete("/account")
async def delete_account(
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    """Delete the current user's account and all their data."""
    from models.models import StudentProfile, RecruiterProfile, Application, Message, Notification

    # Delete profile
    if current_user.role == "student":
        r = await db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id))
        p = r.scalar_one_or_none()
        if p: await db.delete(p)
    else:
        r = await db.execute(select(RecruiterProfile).where(RecruiterProfile.user_id == current_user.id))
        p = r.scalar_one_or_none()
        if p: await db.delete(p)

    # Delete applications
    apps_r = await db.execute(select(Application).where(Application.student_id == current_user.id))
    for a in apps_r.scalars().all():
        await db.delete(a)

    # Delete notifications
    notifs_r = await db.execute(select(Notification).where(Notification.user_id == current_user.id))
    for n in notifs_r.scalars().all():
        await db.delete(n)

    # Delete user
    await db.delete(current_user)
    await db.commit()

    return {"success": True, "message": "Account deleted successfully."}
