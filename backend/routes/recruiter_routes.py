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
