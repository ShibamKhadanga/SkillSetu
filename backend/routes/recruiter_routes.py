from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from config.db import get_db
from models.models import User, RecruiterProfile, Job, Application
from utils.jwt_utils import get_recruiter_user

router = APIRouter()


class RecruiterProfileUpdate(BaseModel):
    company:             Optional[str] = None
    company_description: Optional[str] = None
    industry:            Optional[str] = None
    company_size:        Optional[str] = None
    website:             Optional[str] = None
    location:            Optional[str] = None


@router.get("/dashboard")
async def dashboard(
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    jobs_r = await db.execute(select(Job).where(
        Job.recruiter_id == current_user.id, Job.is_active == True
    ))
    jobs = jobs_r.scalars().all()

    apps_r = await db.execute(select(Application).where(
        Application.recruiter_id == current_user.id
    ))
    apps       = apps_r.scalars().all()
    shortlisted= [a for a in apps if a.status in ("interview","offered")]
    interviews = [a for a in apps if a.status == "interview"]
    recent     = sorted(apps, key=lambda x: x.applied_at, reverse=True)[:5]

    return {"success": True, "data": {
        "stats": {
            "activeJobs":        len(jobs),
            "totalApplications": len(apps),
            "shortlisted":       len(shortlisted),
            "interviews":        len(interviews),
        },
        "recentApplications": [
            {"id": a.id, "name": a.name, "match": a.match_score,
             "status": a.status, "appliedAt": a.applied_at.isoformat()}
            for a in recent
        ],
        "activeJobs": [
            {"id": j.id, "title": j.title,
             "applicants": j.applicants_count, "views": j.views}
            for j in jobs[:5]
        ],
    }}


@router.get("/profile")
async def get_profile(
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    r       = await db.execute(select(RecruiterProfile).where(
        RecruiterProfile.user_id == current_user.id
    ))
    profile = r.scalar_one_or_none()
    return {"success": True, "data": {
        "company":             profile.company             if profile else "",
        "company_description": profile.company_description if profile else "",
        "industry":            profile.industry            if profile else "",
        "website":             profile.website             if profile else "",
        "location":            profile.location            if profile else "",
    }}


@router.put("/profile")
async def update_profile(
    body:         RecruiterProfileUpdate,
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    r       = await db.execute(select(RecruiterProfile).where(
        RecruiterProfile.user_id == current_user.id
    ))
    profile = r.scalar_one_or_none()
    if not profile:
        profile = RecruiterProfile(
            id=str(uuid.uuid4()), user_id=current_user.id,
            company=body.company or current_user.name,
        )
        db.add(profile)

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(profile, field, value)
    await db.commit()
    return {"success": True, "message": "Profile updated! ✅"}


@router.get("/candidates")
async def get_candidates(
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    """Get all student profiles with match scores against recruiter's jobs."""
    from services.matching_service import matching_service

    # Get recruiter's active jobs
    jobs_r = await db.execute(select(Job).where(
        Job.recruiter_id == current_user.id, Job.is_active == True
    ))
    jobs = jobs_r.scalars().all()

    # Get all student profiles
    from models.models import StudentProfile
    students_r = await db.execute(
        select(User, StudentProfile)
        .join(StudentProfile, User.id == StudentProfile.user_id)
        .where(User.role == "student")
    )
    rows = students_r.all()

    candidates = []
    for user_row, profile in rows:
        # Calculate best match across all recruiter's jobs
        best_match = 0
        best_role = ""
        for job in jobs:
            score = matching_service.calculate_match(
                profile.skills or [],
                job.required_skills or [],
                profile.education or [],
                job.min_education,
            )
            if score > best_match:
                best_match = score
                best_role = job.title

        edu_str = ""
        if profile.education and len(profile.education) > 0:
            e = profile.education[0]
            edu_str = f"{e.get('degree', '')} {e.get('institution', '')} {e.get('year', '')}".strip()

        candidates.append({
            "id": user_row.id,
            "name": user_row.name,
            "email": user_row.email,
            "phone": user_row.phone or "",
            "role": profile.suggested_role or profile.career_goal or best_role or "Student",
            "location": profile.location or "India",
            "match": best_match,
            "skills": (profile.skills or [])[:8],
            "education": edu_str,
            "avatar": (user_row.name or "S")[:2].upper(),
            "bio": profile.bio or "",
        })

    # Sort by match score descending
    candidates.sort(key=lambda c: c["match"], reverse=True)
    return {"success": True, "data": candidates}


@router.get("/analytics")
async def get_analytics(
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    """Get live analytics data for the recruiter dashboard."""
    jobs_r = await db.execute(select(Job).where(
        Job.recruiter_id == current_user.id
    ))
    jobs = jobs_r.scalars().all()

    apps_r = await db.execute(select(Application).where(
        Application.recruiter_id == current_user.id
    ))
    apps = apps_r.scalars().all()

    total_views = sum(j.views or 0 for j in jobs)
    avg_match = int(sum(a.match_score or 0 for a in apps) / len(apps)) if apps else 0

    # Status funnel
    status_counts = {}
    for a in apps:
        status_counts[a.status] = status_counts.get(a.status, 0) + 1

    # Skills distribution from applicants
    skill_counts = {}
    for a in apps:
        # We can infer from job required skills
        pass

    return {"success": True, "data": {
        "total_views": total_views,
        "total_applications": len(apps),
        "avg_match": avg_match,
        "active_jobs": len([j for j in jobs if j.is_active]),
        "funnel": {
            "views": total_views,
            "applications": len(apps),
            "shortlisted": status_counts.get("reviewing", 0) + status_counts.get("interview", 0),
            "interviewed": status_counts.get("interview", 0),
            "offered": status_counts.get("offered", 0),
        },
        "status_breakdown": status_counts,
    }}
