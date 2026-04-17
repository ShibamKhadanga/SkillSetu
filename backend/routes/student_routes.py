from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid, logging

from config.db import get_db
from models.models import User, StudentProfile, Job, Application
from utils.jwt_utils import get_student_user
from services.matching_service import calculate_match_score

router = APIRouter()
logger = logging.getLogger(__name__)


class ProfileUpdateRequest(BaseModel):
    name:         Optional[str]       = None
    bio:          Optional[str]       = None
    location:     Optional[str]       = None
    portfolio_url:Optional[str]       = None
    phone:        Optional[str]       = None
    career_goal:  Optional[str]       = None
    interests:    Optional[List[str]] = None
    skills:       Optional[List[str]] = None
    education:    Optional[List[dict]]= None
    projects:     Optional[List[dict]]= None
    achievements: Optional[List[str]] = None
    github_url:   Optional[str]       = None
    linkedin_url: Optional[str]       = None


def calc_strength(p: StudentProfile) -> int:
    score = 0
    if p.bio:                                    score += 10
    if p.location:                               score += 5
    if p.skills       and len(p.skills) >= 3:   score += 20
    if p.education    and len(p.education) >= 1: score += 20
    if p.projects     and len(p.projects) >= 1:  score += 20
    if p.achievements and len(p.achievements)>=1:score += 10
    if p.career_goal:                            score += 10
    if p.linkedin_url or p.github_url:           score += 5
    return score


async def get_or_create_profile(user_id: str, db: AsyncSession) -> StudentProfile:
    r = await db.execute(select(StudentProfile).where(StudentProfile.user_id == user_id))
    profile = r.scalar_one_or_none()
    if not profile:
        profile = StudentProfile(
            id=str(uuid.uuid4()), user_id=user_id,
            skills=[], interests=[], education=[],
            projects=[], achievements=[], certificates=[],
            uploaded_documents=[],
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile


@router.get("/dashboard")
async def dashboard(
    current_user: User          = Depends(get_student_user),
    db:           AsyncSession  = Depends(get_db),
):
    profile = await get_or_create_profile(current_user.id, db)

    # Matched jobs
    jobs_r   = await db.execute(select(Job).where(Job.is_active == True).limit(50))
    all_jobs = jobs_r.scalars().all()

    matched = []
    for job in all_jobs:
        score = calculate_match_score(profile.skills or [], job.required_skills or [])
        if score >= 50:
            matched.append({
                "id": job.id, "title": job.title, "company": job.company,
                "location": job.location, "salary": job.salary,
                "match": score, "skills": job.required_skills or [],
                "posted": job.created_at.strftime("%b %d"),
            })
    matched.sort(key=lambda x: x["match"], reverse=True)

    apps_r     = await db.execute(select(Application).where(Application.student_id == current_user.id))
    apps       = apps_r.scalars().all()
    interviews = [a for a in apps if a.status == "interview"]

    profile.profile_strength = calc_strength(profile)
    await db.commit()

    # Build real recent activity from applications
    status_labels = {
        "new": "Applied", "reviewing": "Under Review",
        "interview": "Interview Scheduled", "offered": "Offer Received 🎉",
        "rejected": "Not Selected",
    }
    act_icons = {"new": "📤", "reviewing": "🔍", "interview": "🎤", "offered": "🏆", "rejected": "❌"}
    recent_activity = [
        {
            "icon": act_icons.get(a.status, "📋"),
            "text": f"{status_labels.get(a.status, 'Applied')} — {getattr(a, 'role', None) or 'Position'} at {a.company or 'Company'}",
            "time": a.applied_at.strftime("%b %d"),
        }
        for a in sorted(apps, key=lambda x: x.applied_at, reverse=True)[:5]
    ]
    if not recent_activity:
        if profile.bio:
            recent_activity.append({"icon": "👤", "text": "Profile bio added", "time": "Recently"})
        if profile.skills:
            recent_activity.append({"icon": "🧠", "text": f"Added {len(profile.skills)} skills to profile", "time": "Recently"})
        if profile.education:
            recent_activity.append({"icon": "🎓", "text": "Education details updated", "time": "Recently"})
        if not recent_activity:
            recent_activity.append({"icon": "🌱", "text": "Welcome to SkillSetu! Complete your profile to get started.", "time": "Now"})

    return {"success": True, "data": {
        "stats": {
            "profileStrength": profile.profile_strength,
            "jobMatches":      len(matched),
            "applications":    len(apps),
            "interviews":      len(interviews),
        },
        "skills":          profile.skills or [],
        "suggestedRole":   profile.suggested_role or profile.career_goal or "Software Developer",
        "roadmapProgress": min(100, (profile.profile_strength or 0) + 5),
        "jobMatches":      matched[:5],
        "recentActivity":  recent_activity,
    }}


@router.get("/profile")
async def get_profile(
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    profile = await get_or_create_profile(current_user.id, db)
    return {"success": True, "data": {
        "name": current_user.name, "email": current_user.email,
        "username": current_user.username, "phone": current_user.phone,
        "avatar_url": current_user.avatar_url,
        "bio": profile.bio, "location": profile.location,
        "portfolio_url": profile.portfolio_url,
        "github_url": profile.github_url, "linkedin_url": profile.linkedin_url,
        "career_goal": profile.career_goal,
        "suggested_role": profile.suggested_role,
        "skills":       profile.skills       or [],
        "interests":    profile.interests    or [],
        "education":    profile.education    or [],
        "projects":     profile.projects     or [],
        "achievements": profile.achievements or [],
        "certificates": profile.certificates or [],
        "uploaded_documents": profile.uploaded_documents or [],
        "ai_roadmap":   profile.ai_roadmap,
        "profile_strength": profile.profile_strength,
    }}


@router.put("/profile")
async def update_profile(
    body:         ProfileUpdateRequest,
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    profile = await get_or_create_profile(current_user.id, db)

    if body.name:  current_user.name  = body.name
    if body.phone: current_user.phone = body.phone
    current_user.updated_at = datetime.utcnow()

    for field, value in body.model_dump(exclude_none=True, exclude={"name","phone"}).items():
        setattr(profile, field, value)

    profile.profile_strength = calc_strength(profile)
    profile.updated_at       = datetime.utcnow()
    await db.commit()

    return {"success": True, "message": "Profile saved! ✅",
            "data": {"profile_strength": profile.profile_strength}}


@router.post("/upload-document")
async def upload_document(
    file:         UploadFile   = File(...),
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    allowed = [
        "application/pdf", "image/jpeg", "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if file.content_type not in allowed:
        raise HTTPException(400, "File type not supported (PDF, JPG, PNG, DOC only)")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large — max 10 MB")

    # Try Cloudinary; fall back gracefully if not configured
    url = f"local://{file.filename}"
    try:
        from config.cloudinary_config import upload_file as cloud_upload
        result = await cloud_upload(contents, file.filename, f"skillsetu/{current_user.id}")
        url    = result["url"]
    except Exception:
        pass  # Cloudinary not configured — file name saved only

    profile = await get_or_create_profile(current_user.id, db)
    docs    = list(profile.uploaded_documents or [])
    docs.append({"name": file.filename, "url": url,
                 "uploaded_at": datetime.utcnow().isoformat()})
    profile.uploaded_documents = docs
    await db.commit()

    return {"success": True,
            "data": {"url": url, "name": file.filename},
            "message": f"{file.filename} uploaded! ✅"}


@router.post("/upload-avatar")
async def upload_avatar(
    file:         UploadFile   = File(...),
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed:
        raise HTTPException(400, "Only image files are allowed (JPG, PNG, WebP)")

    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(400, "Image too large — max 2 MB")

    # Try Cloudinary; fall back to base64 data URL
    import base64
    url = f"data:{file.content_type};base64,{base64.b64encode(contents).decode()}"
    try:
        from config.cloudinary_config import upload_file as cloud_upload
        result = await cloud_upload(contents, file.filename, f"skillsetu/avatars/{current_user.id}")
        url    = result["url"]
    except Exception:
        pass  # Cloudinary not configured — use data URL

    current_user.avatar_url = url
    current_user.updated_at = datetime.utcnow()
    await db.commit()

    return {"success": True,
            "data": {"avatar_url": url},
            "message": "Profile photo updated! 📸"}


@router.post("/resume/download")
async def download_resume(
    body:         dict,
    current_user: User = Depends(get_student_user),
):
    from services.resume_service import generate_resume_pdf
    from fastapi.responses import Response

    pdf   = await generate_resume_pdf(body.get("resume", {}), body.get("template", "modern"))
    fname = f"{current_user.name.replace(' ','_')}_SkillSetu_Resume.pdf"
    return Response(content=pdf, media_type="application/pdf",
                    headers={"Content-Disposition": f'attachment; filename="{fname}"'})
