"""
SkillSetu — Notification Service
Handles in-app notifications, WhatsApp (Twilio), and SMS.
Gracefully degrades when Twilio is not configured.
"""

import uuid
import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from models.models import Notification, User
from config.settings import settings

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────
# Twilio / WhatsApp client (lazy init)
# ──────────────────────────────────────────────
_twilio_client = None


def _get_twilio_client():
    """Lazily initialize the Twilio client. Returns None if not configured."""
    global _twilio_client
    if _twilio_client is not None:
        return _twilio_client

    sid   = settings.TWILIO_ACCOUNT_SID
    token = settings.TWILIO_AUTH_TOKEN
    if not sid or not token:
        logger.info("Twilio not configured — WhatsApp/SMS disabled")
        return None

    try:
        from twilio.rest import Client
        _twilio_client = Client(sid, token)
        logger.info("Twilio client initialized ✅")
        return _twilio_client
    except ImportError:
        logger.warning("twilio package not installed — run: pip install twilio")
        return None
    except Exception as e:
        logger.error(f"Twilio init failed: {e}")
        return None


# ──────────────────────────────────────────────
# Send WhatsApp message
# ──────────────────────────────────────────────
async def send_whatsapp(phone: str, message: str) -> bool:
    """
    Send a WhatsApp message via Twilio.
    Phone should be in format: 919876543210 (country code + number)
    Returns True if sent, False otherwise.
    """
    client = _get_twilio_client()
    if not client:
        return False

    try:
        # Normalize phone number
        phone = phone.strip().replace(" ", "").replace("-", "")
        if not phone.startswith("+"):
            if phone.startswith("91"):
                phone = f"+{phone}"
            else:
                phone = f"+91{phone}"  # Default to India

        msg = client.messages.create(
            from_=settings.TWILIO_WHATSAPP_FROM,
            to=f"whatsapp:{phone}",
            body=message,
        )
        logger.info(f"WhatsApp sent to {phone}: SID={msg.sid}")
        return True
    except Exception as e:
        logger.error(f"WhatsApp send failed to {phone}: {e}")
        return False


# ──────────────────────────────────────────────
# Send SMS
# ──────────────────────────────────────────────
async def send_sms(phone: str, message: str) -> bool:
    """Send an SMS via Twilio."""
    client = _get_twilio_client()
    if not client or not settings.TWILIO_SMS_FROM:
        return False

    try:
        phone = phone.strip().replace(" ", "").replace("-", "")
        if not phone.startswith("+"):
            phone = f"+91{phone}" if not phone.startswith("91") else f"+{phone}"

        msg = client.messages.create(
            from_=settings.TWILIO_SMS_FROM,
            to=phone,
            body=message,
        )
        logger.info(f"SMS sent to {phone}: SID={msg.sid}")
        return True
    except Exception as e:
        logger.error(f"SMS send failed to {phone}: {e}")
        return False


# ──────────────────────────────────────────────
# Create notification (in-app + WhatsApp + SMS)
# ──────────────────────────────────────────────
async def create_notification(
    db: AsyncSession,
    user_id: str,
    title: str,
    body: str,
    notif_type: str = "general",
    link: str = None,
    phone: str = None,
    send_wa: bool = True,
    send_sms_flag: bool = False,
) -> Notification:
    """
    Create an in-app notification and optionally send WhatsApp/SMS.

    Args:
        db:        Async database session
        user_id:   Target user ID
        title:     Notification title
        body:      Notification body text
        notif_type: e.g. 'application', 'job', 'message'
        link:      In-app link for notification
        phone:     User's phone number (for WhatsApp/SMS)
        send_wa:   Whether to attempt WhatsApp delivery
        send_sms_flag: Whether to attempt SMS delivery
    """
    # 1. Create in-app notification
    notif = Notification(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        body=body,
        type=notif_type,
        link=link,
    )
    db.add(notif)

    # 2. WhatsApp
    wa_sent = False
    if send_wa and phone:
        wa_message = f"🔔 *SkillSetu*\n\n*{title}*\n{body}\n\n📱 Open app to view details"
        wa_sent = await send_whatsapp(phone, wa_message)
        notif.whatsapp_sent = wa_sent

    # 3. SMS
    sms_sent = False
    if send_sms_flag and phone:
        sms_message = f"SkillSetu: {title} - {body}"
        sms_sent = await send_sms(phone, sms_message)
        notif.sms_sent = sms_sent

    await db.commit()

    logger.info(
        f"Notification created for user={user_id}: "
        f"in_app=✅ whatsapp={'✅' if wa_sent else '❌'} sms={'✅' if sms_sent else '❌'}"
    )
    return notif


# ──────────────────────────────────────────────
# Convenience methods for common notification types
# ──────────────────────────────────────────────
async def notify_application_status(
    db: AsyncSession, student_id: str, student_phone: str,
    job_title: str, company: str, new_status: str,
):
    """Notify student when their application status changes."""
    status_msgs = {
        "reviewing": ("Application Under Review 🔍",
                      f"Your application for {job_title} at {company} is being reviewed."),
        "interview": ("Interview Shortlisted! 🎉",
                      f"Congratulations! You've been shortlisted for an interview for {job_title} at {company}!"),
        "offered":   ("Job Offer Received! 🎊",
                      f"Amazing news! You've received a job offer for {job_title} at {company}!"),
        "rejected":  ("Application Update",
                      f"Your application for {job_title} at {company} was not selected. Keep trying! 💪"),
    }

    if new_status not in status_msgs:
        return None

    title, body = status_msgs[new_status]
    return await create_notification(
        db=db, user_id=student_id, title=title, body=body,
        notif_type="application", link="/student/applications",
        phone=student_phone, send_wa=True,
    )


async def notify_new_application(
    db: AsyncSession, recruiter_id: str, recruiter_phone: str,
    student_name: str, job_title: str, match_score: int,
):
    """Notify recruiter when a student applies to their job."""
    title = f"New Application: {job_title}"
    body = f"{student_name} applied to {job_title} (Match: {match_score}%)"
    return await create_notification(
        db=db, user_id=recruiter_id, title=title, body=body,
        notif_type="application", link="/recruiter/applications",
        phone=recruiter_phone, send_wa=True,
    )


async def notify_new_job(
    db: AsyncSession, student_id: str, student_phone: str,
    job_title: str, company: str, match_score: int,
):
    """Notify student when a new matching job is posted."""
    title = f"New Job Match: {job_title}"
    body = f"{company} posted {job_title} — {match_score}% match with your profile!"
    return await create_notification(
        db=db, user_id=student_id, title=title, body=body,
        notif_type="job", link="/student/jobs",
        phone=student_phone, send_wa=True,
    )
