from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from config.db import get_db
from models.models import User, StudentProfile
from utils.jwt_utils import get_current_user, get_student_user
from services.gemini_service import gemini_service

router = APIRouter()


class ExtractSkillsRequest(BaseModel):
    projects:     Optional[List[dict]] = []
    education:    Optional[List[dict]] = []
    achievements: Optional[List[str]]  = []
    certificates: Optional[List[str]]  = []

class RoadmapRequest(BaseModel):
    goal:           str
    current_skills: Optional[List[str]]  = []
    education:      Optional[List[dict]] = []

class ResumeRequest(BaseModel):
    target_role: Optional[str] = None
    template:    Optional[str] = "modern"

class MockInterviewRequest(BaseModel):
    role:           str
    answer:         str
    question_index: int
    history:        Optional[List[dict]] = []

class JobDescRequest(BaseModel):
    title:   str
    company: Optional[str]       = None
    skills:  Optional[List[str]] = []

class ResumeScoreRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Professional"

class SalaryRequest(BaseModel):
    role:       str
    location:   Optional[str] = "India"
    experience: Optional[str] = "Fresher"

class GovtJobsRequest(BaseModel):
    field:     Optional[str] = "General"
    education: Optional[str] = "Graduate"
    state:     Optional[str] = "All India"


async def _get_profile(user_id: str, db: AsyncSession) -> Optional[StudentProfile]:
    r = await db.execute(select(StudentProfile).where(StudentProfile.user_id == user_id))
    return r.scalar_one_or_none()


@router.post("/extract-skills")
async def extract_skills(
    body:         ExtractSkillsRequest,
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    skills = await gemini_service.extract_skills(
        body.projects, body.education, body.achievements, body.certificates
    )
    profile = await _get_profile(current_user.id, db)
    if profile:
        profile.skills = list(set((profile.skills or []) + skills))
        await db.commit()
    return {"success": True,
            "data": {"skills": skills},
            "message": f"AI detected {len(skills)} skills! 🧠"}


@router.post("/generate-roadmap")
async def generate_roadmap(
    body:         RoadmapRequest,
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    roadmap = await gemini_service.generate_roadmap(body.goal, body.current_skills, body.education)
    profile = await _get_profile(current_user.id, db)
    if profile:
        profile.career_goal    = body.goal
        profile.ai_roadmap     = roadmap
        profile.suggested_role = body.goal
        await db.commit()
    return {"success": True, "data": roadmap, "message": "Roadmap generated! 🗺️"}


@router.post("/generate-resume")
async def generate_resume(
    body:         ResumeRequest,
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    profile     = await _get_profile(current_user.id, db)
    resume_data = await gemini_service.build_resume(current_user, profile, body.target_role)
    return {"success": True,
            "resume": resume_data,
            "message": "Resume generated! ✨"}


@router.post("/mock-interview")
async def mock_interview(
    body:         MockInterviewRequest,
    current_user: User = Depends(get_student_user),
):
    result = await gemini_service.evaluate_interview_answer(
        body.role, body.answer, body.question_index, body.history
    )
    return {"success": True, "data": result}


@router.post("/generate-job-description")
async def generate_job_desc(
    body:         JobDescRequest,
    current_user: User = Depends(get_current_user),
):
    desc = await gemini_service.generate_job_description(body.title, body.company, body.skills)
    return {"success": True, "data": {"description": desc}}


@router.post("/skill-gap")
async def skill_gap(
    body:         dict,
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    job_skills  = body.get("job_skills", [])
    profile     = await _get_profile(current_user.id, db)
    user_skills = profile.skills or [] if profile else []

    matching = [s for s in job_skills if s.lower() in [u.lower() for u in user_skills]]
    missing  = [s for s in job_skills if s.lower() not in [u.lower() for u in user_skills]]
    recs     = await gemini_service.analyze_skill_gap(user_skills, job_skills, missing)

    return {"success": True, "data": {
        "matching_skills":  matching,
        "missing_skills":   missing,
        "match_percentage": int(len(matching)/len(job_skills)*100) if job_skills else 0,
        "recommendations":  recs,
    }}


@router.post("/suggest-roles")
async def suggest_roles(
    current_user: User         = Depends(get_student_user),
    db:           AsyncSession = Depends(get_db),
):
    profile = await _get_profile(current_user.id, db)
    if not profile or not profile.skills:
        return {"success": True, "data": {"roles": ["Software Developer", "Data Analyst"]}}
    roles = await gemini_service.suggest_job_roles(
        profile.skills, profile.education or [], profile.interests or []
    )
    return {"success": True, "data": {"roles": roles}}


# ===================================================================
# NEW — Resume Score Checker
# ===================================================================
@router.post("/score-resume")
async def score_resume(
    body:         ResumeScoreRequest,
    current_user: User = Depends(get_student_user),
):
    result = await gemini_service.score_resume(body.resume_text, body.target_role)
    return {"success": True, "data": result, "message": "Resume scored! 📊"}


# ===================================================================
# NEW — Salary Insights
# ===================================================================
@router.post("/salary-insights")
async def salary_insights(
    body:         SalaryRequest,
    current_user: User = Depends(get_current_user),
):
    result = await gemini_service.get_salary_insights(body.role, body.location, body.experience)
    return {"success": True, "data": result, "message": "Salary insights ready! 💰"}


# ===================================================================
# NEW — Government Job Finder
# ===================================================================
@router.post("/govt-jobs")
async def govt_jobs(
    body:         GovtJobsRequest,
    current_user: User = Depends(get_student_user),
):
    result = await gemini_service.find_govt_jobs(body.field, body.education, body.state)
    return {"success": True, "data": result, "message": "Government jobs found! 🏛️"}
