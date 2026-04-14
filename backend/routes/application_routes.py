from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from config.db import get_db
from models.models import User, Application, Job
from utils.jwt_utils import get_student_user, get_recruiter_user

router = APIRouter()


@router.get("/my")
async def my_applications(
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    r    = await db.execute(select(Application)
           .where(Application.student_id == current_user.id)
           .order_by(Application.applied_at.desc()))
    apps = r.scalars().all()

    out = []
    for a in apps:
        jr  = await db.execute(select(Job).where(Job.id == a.job_id))
        job = jr.scalar_one_or_none()
        out.append({
            "id":          a.id,
            "role":        job.title    if job else "Unknown",
            "company":     job.company  if job else "Unknown",
            "location":    job.location if job else "",
            "salary":      job.salary   if job else "",
            "status":      a.status,
            "match_score": a.match_score,
            "applied_at":  a.applied_at.isoformat(),
            "notes":       a.notes,
        })
    return {"success": True, "data": out}


@router.get("/job/{job_id}")
async def job_applications(
    job_id:       str,
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    jr = await db.execute(select(Job).where(
        Job.id == job_id, Job.recruiter_id == current_user.id
    ))
    if not jr.scalar_one_or_none():
        raise HTTPException(403, "Not authorized")

    r    = await db.execute(select(Application)
           .where(Application.job_id == job_id)
           .order_by(Application.applied_at.desc()))
    apps = r.scalars().all()
    return {"success": True, "data": [
        {"id": a.id, "name": a.name, "email": a.email, "phone": a.phone,
         "match_score": a.match_score, "status": a.status,
         "cover_letter": a.cover_letter, "experience": a.experience,
         "applied_at": a.applied_at.isoformat()}
        for a in apps
    ]}


@router.patch("/{app_id}/status")
async def update_status(
    app_id:       str,
    body:         dict,
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    r   = await db.execute(select(Application).where(
        Application.id == app_id, Application.recruiter_id == current_user.id
    ))
    app = r.scalar_one_or_none()
    if not app:
        raise HTTPException(404, "Application not found")

    valid      = ["new","reviewing","interview","offered","rejected"]
    new_status = body.get("status")
    if new_status not in valid:
        raise HTTPException(400, f"Status must be one of {valid}")

    app.status     = new_status
    app.notes      = body.get("notes", app.notes)
    app.updated_at = datetime.utcnow()
    await db.commit()

    # Notify the student (in-app only; WhatsApp/SMS optional)
    jr  = await db.execute(select(Job).where(Job.id == app.job_id))
    job = jr.scalar_one_or_none()
    msgs = {
        "reviewing": "Your application is under review 🔍",
        "interview": "🎉 You've been shortlisted for an interview!",
        "offered":   "🎊 Congratulations! You have received a job offer!",
        "rejected":  "Your application was not selected this time. Keep applying! 💪",
    }
    if new_status in msgs:
        from models.models import Notification
        import uuid
        db.add(Notification(
            id=str(uuid.uuid4()), user_id=app.student_id,
            title=f"Application update — {job.title if job else 'Job'}",
            body=msgs[new_status], type="application",
            link="/student/applications",
        ))
        await db.commit()

    return {"success": True, "message": f"Status updated to '{new_status}'"}
