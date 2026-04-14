from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
import uuid

from config.db import get_db
from models.models import User, Message, Notification
from utils.jwt_utils import get_current_user

router = APIRouter()


class SendMessageRequest(BaseModel):
    receiver_id: str
    content:     str


def conv_id(a: str, b: str) -> str:
    return "_".join(sorted([a, b]))


@router.post("/send")
async def send_message(
    body:         SendMessageRequest,
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    r        = await db.execute(select(User).where(User.id == body.receiver_id))
    receiver = r.scalar_one_or_none()
    if not receiver:
        raise HTTPException(404, "Recipient not found")

    cid = conv_id(current_user.id, body.receiver_id)
    msg = Message(
        id=str(uuid.uuid4()),
        sender_id=current_user.id,
        receiver_id=body.receiver_id,
        conversation_id=cid,
        content=body.content,
    )
    db.add(msg)

    # In-app notification for student when recruiter writes
    if receiver.role == "student" and current_user.role == "recruiter":
        db.add(Notification(
            id=str(uuid.uuid4()), user_id=receiver.id,
            title=f"New message from {current_user.name}",
            body=body.content[:100], type="message",
            link="/student/messages",
        ))

    await db.commit()
    return {"success": True,
            "data": {"conversation_id": cid},
            "message": "Message sent! 💬"}


@router.get("/conversations")
async def get_conversations(
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    uid    = current_user.id
    result = await db.execute(
        select(Message)
        .where(or_(Message.sender_id == uid, Message.receiver_id == uid))
        .order_by(Message.sent_at.desc())
    )
    msgs = result.scalars().all()

    seen = {}
    for msg in msgs:
        cid = msg.conversation_id
        if cid not in seen:
            other_id = msg.receiver_id if msg.sender_id == uid else msg.sender_id
            ou       = await db.execute(select(User).where(User.id == other_id))
            other    = ou.scalar_one_or_none()
            if other:
                unread_r = await db.execute(select(Message).where(
                    Message.conversation_id == cid,
                    Message.receiver_id     == uid,
                    Message.is_read         == False,
                ))
                unread = len(unread_r.scalars().all())
                seen[cid] = {
                    "conversation_id": cid,
                    "other_user": {"id": other.id, "name": other.name, "role": other.role},
                    "last_message": msg.content,
                    "last_time":    msg.sent_at.isoformat(),
                    "unread_count": unread,
                }
    return {"success": True, "data": list(seen.values())}


@router.get("/{conversation_id}")
async def get_messages(
    conversation_id: str,
    current_user:    User         = Depends(get_current_user),
    db:              AsyncSession = Depends(get_db),
):
    if current_user.id not in conversation_id.split("_"):
        raise HTTPException(403, "Not authorized to view this conversation")

    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.sent_at)
    )
    msgs = result.scalars().all()

    for msg in msgs:
        if msg.receiver_id == current_user.id and not msg.is_read:
            msg.is_read = True
    await db.commit()

    return {"success": True, "data": [
        {"id": m.id, "sender_id": m.sender_id, "content": m.content,
         "is_mine": m.sender_id == current_user.id,
         "time": m.sent_at.isoformat()}
        for m in msgs
    ]}
