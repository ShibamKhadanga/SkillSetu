from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from config.db import get_db
from models.models import User, Job, StudentProfile, Application
from utils.jwt_utils import get_recruiter_user, get_current_user
from services.matching_service import calculate_match_score

router = APIRouter()


class JobCreateRequest(BaseModel):
    title:             str
    company:           str
    description:       str
    location:          str
    job_type:          str
    salary:            Optional[str]       = None
    experience:        Optional[str]       = None
    required_skills:   List[str]           = []
    perks:             Optional[str]       = None
    is_remote:         bool                = False
    urgent:            bool                = False
    deadline:          Optional[str]       = None
    notify_candidates: bool                = True


@router.post("/")
async def create_job(
    body:         JobCreateRequest,
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    job = Job(id=str(uuid.uuid4()), recruiter_id=current_user.id, **body.model_dump())
    db.add(job)
    await db.commit()
    return {"success": True,
            "data": {"id": job.id},
            "message": "Job posted! AI is matching candidates... 🎯"}


@router.get("/")
async def list_jobs(
    search:       Optional[str] = None,
    job_type:     Optional[str] = None,
    page:         int = Query(1,  ge=1),
    limit:        int = Query(20, ge=1, le=100),
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    q = select(Job).where(Job.is_active == True)
    if job_type:
        q = q.where(Job.job_type == job_type)
    result   = await db.execute(q)
    all_jobs = result.scalars().all()

    # Match scores for students
    match_scores = {}
    if current_user.role == "student":
        pr = await db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id))
        profile = pr.scalar_one_or_none()
        if profile:
            for job in all_jobs:
                match_scores[job.id] = calculate_match_score(
                    profile.skills or [], job.required_skills or []
                )

    if search:
        s        = search.lower()
        all_jobs = [j for j in all_jobs
                    if s in j.title.lower() or s in j.company.lower()
                    or any(s in sk.lower() for sk in (j.required_skills or []))]

    jobs_out = [{
        "id": j.id, "title": j.title, "company": j.company,
        "location": j.location, "job_type": j.job_type,
        "salary": j.salary, "is_remote": j.is_remote, "urgent": j.urgent,
        "required_skills": j.required_skills or [],
        "description": j.description,
        "match": match_scores.get(j.id, 0),
        "posted": j.created_at.strftime("%b %d, %Y"),
    } for j in all_jobs]

    if current_user.role == "student":
        jobs_out.sort(key=lambda x: x["match"], reverse=True)

    total = len(jobs_out)
    start = (page - 1) * limit
    return {"success": True,
            "data": jobs_out[start:start+limit],
            "total": total}


@router.get("/my-jobs")
async def my_jobs(
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    r    = await db.execute(select(Job).where(Job.recruiter_id == current_user.id))
    jobs = r.scalars().all()
    return {"success": True, "data": [
        {"id": j.id, "title": j.title, "is_active": j.is_active,
         "applicants_count": j.applicants_count, "views": j.views}
        for j in jobs
    ]}


@router.post("/{job_id}/apply")
async def apply_to_job(
    job_id:       str,
    body:         dict,
    current_user: User         = Depends(get_current_user),
    db:           AsyncSession = Depends(get_db),
):
    r   = await db.execute(select(Job).where(Job.id == job_id))
    job = r.scalar_one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")

    dup = await db.execute(select(Application).where(
        Application.job_id == job_id, Application.student_id == current_user.id
    ))
    if dup.scalar_one_or_none():
        raise HTTPException(400, "You have already applied to this job")

    pr      = await db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id))
    profile = pr.scalar_one_or_none()
    match   = calculate_match_score(
        profile.skills or [] if profile else [], job.required_skills or []
    )

    app = Application(
        id            = str(uuid.uuid4()),
        job_id        = job_id,
        student_id    = current_user.id,
        recruiter_id  = job.recruiter_id,
        name          = body.get("name",          current_user.name),
        email         = body.get("email",         current_user.email),
        phone         = body.get("phone",         current_user.phone or ""),
        cover_letter  = body.get("cover_letter"),
        experience    = body.get("experience"),
        notice_period = body.get("notice_period", "Immediate"),
        match_score   = match,
    )
    db.add(app)
    job.applicants_count += 1
    await db.commit()

    return {"success": True,
            "message": "Application submitted successfully! 🎉",
            "data": {"application_id": app.id}}


@router.delete("/{job_id}")
async def delete_job(
    job_id:       str,
    current_user: User         = Depends(get_recruiter_user),
    db:           AsyncSession = Depends(get_db),
):
    r   = await db.execute(select(Job).where(Job.id == job_id, Job.recruiter_id == current_user.id))
    job = r.scalar_one_or_none()
    if not job:
        raise HTTPException(404, "Job not found")
    job.is_active = False
    await db.commit()
    return {"success": True, "message": "Job deactivated"}
