from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from config.db import get_db
from models.models import User, Notification
from utils.jwt_utils import get_current_user

router = APIRouter()


@router.get("/")
async def get_notifications(
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    r      = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
    )
    notifs = r.scalars().all()
    return {"success": True, "data": [
        {"id": n.id, "title": n.title, "body": n.body,
         "type": n.type, "is_read": n.is_read, "link": n.link,
         "created_at": n.created_at.isoformat()}
        for n in notifs
    ]}


@router.get("/unread-count")
async def unread_count(
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    r     = await db.execute(select(Notification).where(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ))
    count = len(r.scalars().all())
    return {"success": True, "data": {"count": count}}


@router.patch("/read-all")
async def mark_all_read(
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    r = await db.execute(select(Notification).where(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ))
    for n in r.scalars().all():
        n.is_read = True
    await db.commit()
    return {"success": True, "message": "All notifications marked as read ✅"}


@router.patch("/{notif_id}/read")
async def mark_one_read(
    notif_id:     str,
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    r = await db.execute(select(Notification).where(
        Notification.id      == notif_id,
        Notification.user_id == current_user.id,
    ))
    n = r.scalar_one_or_none()
    if n:
        n.is_read = True
        await db.commit()
    return {"success": True, "message": "Marked as read"}
