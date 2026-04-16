from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta

from config.db import get_db
from models.models import User, StudentProfile, RecruiterProfile, Job, Application
from utils.jwt_utils import get_current_user

router = APIRouter()


async def require_admin(current_user: User = Depends(get_current_user)):
    """Allow any authenticated user for SIH demo. In production, restrict to admin role."""
    return current_user


@router.get("/stats")
async def get_stats(
    current_user: User         = Depends(require_admin),
    db:           AsyncSession = Depends(get_db),
):
    """Platform-wide stats for admin overview."""
    users_r    = await db.execute(select(func.count(User.id)))
    students_r = await db.execute(select(func.count(User.id)).where(User.role == "student"))
    recruit_r  = await db.execute(select(func.count(User.id)).where(User.role == "recruiter"))
    jobs_r     = await db.execute(select(func.count(Job.id)).where(Job.is_active == True))
    apps_r     = await db.execute(select(func.count(Application.id)))

    return {"success": True, "data": {
        "total_users":      users_r.scalar() or 0,
        "total_students":   students_r.scalar() or 0,
        "total_recruiters": recruit_r.scalar() or 0,
        "active_jobs":      jobs_r.scalar() or 0,
        "total_applications": apps_r.scalar() or 0,
    }}


@router.get("/users")
async def list_users(
    current_user: User         = Depends(require_admin),
    db:           AsyncSession = Depends(get_db),
):
    """List all registered users with profile summaries."""
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).limit(200)
    )
    users = result.scalars().all()

    user_list = []
    for u in users:
        if u.role == "student":
            pr = await db.execute(select(StudentProfile).where(StudentProfile.user_id == u.id))
            profile = pr.scalar_one_or_none()
            extra = {
                "skills": (profile.skills or [])[:5] if profile else [],
                "profile_strength": profile.profile_strength or 0 if profile else 0,
                "career_goal": profile.career_goal or profile.suggested_role or "" if profile else "",
                "location": profile.location or "" if profile else "",
            }
        else:
            pr = await db.execute(select(RecruiterProfile).where(RecruiterProfile.user_id == u.id))
            profile = pr.scalar_one_or_none()
            extra = {
                "company": profile.company if profile else u.company or "",
                "industry": profile.industry if profile else "",
                "location": profile.location if profile else "",
            }
        user_list.append({
            "id":         u.id,
            "name":       u.name,
            "email":      u.email,
            "username":   u.username,
            "role":       u.role,
            "phone":      u.phone,
            "is_verified": u.is_verified,
            "created_at": u.created_at.isoformat(),
            **extra,
        })

    return {"success": True, "data": user_list}


@router.get("/jobs")
async def list_all_jobs(
    current_user: User         = Depends(require_admin),
    db:           AsyncSession = Depends(get_db),
):
    """List all jobs for admin view."""
    result = await db.execute(select(Job).order_by(Job.created_at.desc()))
    jobs   = result.scalars().all()
    return {"success": True, "data": [
        {
            "id": j.id, "title": j.title, "company": j.company,
            "location": j.location, "job_type": j.job_type,
            "salary": j.salary, "is_active": j.is_active,
            "views": j.views, "applicants_count": j.applicants_count,
            "created_at": j.created_at.isoformat(),
        }
        for j in jobs
    ]}
