"""
SkillSetu — Demo Data Seeder
Run this from inside the backend/ folder:

    cd skillsetu_sqlite/backend
    python seed.py

Creates demo login accounts for SIH presentation.
"""

import asyncio
import sys
import os

# Make sure Python can find the local modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
import uuid

DATABASE_URL = "sqlite+aiosqlite:///./skillsetu.db"
engine  = create_async_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def seed():
    print("=" * 50)
    print("🌱  SkillSetu Seeder — SQLite")
    print("=" * 50)

    # Import models AFTER path is set
    from models.models import Base, User, StudentProfile, RecruiterProfile, Job
    from utils.jwt_utils import hash_password

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created/verified")

    async with Session() as db:

        # ── Clear old demo data ────────────────────────
        demo_emails = [
            "priya@demo.com", "rahul@demo.com",
            "hr@techcorp.demo", "hr@aisolutions.demo",
        ]
        for email in demo_emails:
            r = await db.execute(select(User).where(User.email == email))
            u = r.scalar_one_or_none()
            if u:
                await db.delete(u)
        await db.commit()
        print("🧹 Old demo data cleared")

        # ── Students ───────────────────────────────────
        print("\n👨‍🎓 Creating students...")

        students = [
            {
                "name": "Priya Sharma", "username": "priya_sharma",
                "email": "priya@demo.com", "phone": "9876543210",
                "skills": ["React", "Node.js", "MongoDB", "Python", "Git"],
                "education": [{"degree": "B.Tech CS", "institution": "IIT Bombay", "year": "2024", "cgpa": "8.9"}],
                "bio": "Full stack developer passionate about building scalable web apps.",
                "location": "Bangalore",
                "interests": ["Web Development", "Cloud Computing"],
                "achievements": ["Winner - Smart India Hackathon 2023", "Google Code Jam Top 100"],
                "projects": [
                    {"name": "SkillSetu", "description": "AI career bridge platform", "tech": "React, Python"},
                    {"name": "E-Commerce App", "description": "Full-stack shopping platform with 1000+ users", "tech": "React, Node.js"},
                ],
            },
            {
                "name": "Rahul Verma", "username": "rahul_verma",
                "email": "rahul@demo.com", "phone": "9876543211",
                "skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "Pandas"],
                "education": [{"degree": "B.Tech IT", "institution": "NIT Warangal", "year": "2024", "cgpa": "8.5"}],
                "bio": "ML enthusiast building intelligent systems to solve real-world problems.",
                "location": "Hyderabad",
                "interests": ["Machine Learning", "Data Science"],
                "achievements": ["Kaggle Expert", "Published ML paper in IEEE"],
                "projects": [
                    {"name": "Price Predictor", "description": "ML model with 94% accuracy", "tech": "Python, Scikit-learn"},
                ],
            },
        ]

        for s in students:
            uid  = str(uuid.uuid4())
            user = User(
                id=uid, name=s["name"], username=s["username"],
                email=s["email"], phone=s["phone"],
                password_hash=hash_password("Demo@1234"),
                role="student", is_verified=True,
            )
            db.add(user)
            db.add(StudentProfile(
                id=str(uuid.uuid4()), user_id=uid,
                bio=s["bio"], location=s["location"],
                skills=s["skills"], interests=s["interests"],
                education=s["education"], projects=s["projects"],
                achievements=s["achievements"],
                certificates=[], uploaded_documents=[],
                profile_strength=85,
                suggested_role=s["interests"][0],
            ))
            print(f"   ✅  {s['name']}  |  {s['email']}  |  password: Demo@1234")

        # ── Recruiters ─────────────────────────────────
        print("\n🏢 Creating recruiters...")

        recruiters = [
            {
                "name": "TechCorp HR", "username": "techcorp_hr",
                "email": "hr@techcorp.demo", "phone": "9876540001",
                "company": "TechCorp India", "industry": "Software", "location": "Bangalore",
            },
            {
                "name": "AI Solutions HR", "username": "aisolutions_hr",
                "email": "hr@aisolutions.demo", "phone": "9876540002",
                "company": "AI Solutions Pvt Ltd", "industry": "AI", "location": "Hyderabad",
            },
        ]

        recruiter_ids = []
        for r in recruiters:
            uid  = str(uuid.uuid4())
            user = User(
                id=uid, name=r["name"], username=r["username"],
                email=r["email"], phone=r["phone"],
                password_hash=hash_password("Demo@1234"),
                role="recruiter", is_verified=True,
            )
            db.add(user)
            db.add(RecruiterProfile(
                id=str(uuid.uuid4()), user_id=uid,
                company=r["company"], industry=r["industry"],
                location=r["location"], is_verified=True,
            ))
            recruiter_ids.append(uid)
            print(f"   ✅  {r['name']}  |  {r['email']}  |  password: Demo@1234")

        await db.commit()

        # ── Jobs ───────────────────────────────────────
        print("\n💼 Creating jobs...")

        jobs = [
            {
                "title": "Full Stack Developer",
                "company": "TechCorp India",
                "description": "Build scalable web applications using React and Node.js. Work with a talented team on cutting-edge products.",
                "location": "Bangalore", "job_type": "full-time",
                "salary": "₹8-12 LPA", "experience": "fresher",
                "required_skills": ["React", "Node.js", "MongoDB", "Git"],
                "is_remote": False, "urgent": True,
                "perks": "Health insurance, MacBook, Free lunch",
                "recruiter_idx": 0,
            },
            {
                "title": "Machine Learning Engineer",
                "company": "AI Solutions Pvt Ltd",
                "description": "Build production ML models impacting millions of users.",
                "location": "Remote", "job_type": "full-time",
                "salary": "₹12-18 LPA", "experience": "1",
                "required_skills": ["Python", "Machine Learning", "TensorFlow", "SQL"],
                "is_remote": True, "urgent": False,
                "perks": "100% remote, Flexible hours, Stock options",
                "recruiter_idx": 1,
            },
            {
                "title": "Frontend Developer Intern",
                "company": "TechCorp India",
                "description": "Work with founders to build the next big product.",
                "location": "Mumbai", "job_type": "internship",
                "salary": "₹25,000/month", "experience": "fresher",
                "required_skills": ["React", "TypeScript", "CSS", "JavaScript"],
                "is_remote": False, "urgent": True,
                "perks": "PPO possibility, IIT mentorship",
                "recruiter_idx": 0,
            },
            {
                "title": "Data Analyst",
                "company": "AI Solutions Pvt Ltd",
                "description": "Analyze business data and provide actionable insights.",
                "location": "Pune", "job_type": "full-time",
                "salary": "₹6-9 LPA", "experience": "fresher",
                "required_skills": ["SQL", "Python", "Power BI", "Excel"],
                "is_remote": False, "urgent": False,
                "perks": "Medical insurance, PF, Gratuity",
                "recruiter_idx": 1,
            },
        ]

        for i, j in enumerate(jobs):
            rid = recruiter_ids[j.pop("recruiter_idx")]
            db.add(Job(
                id=str(uuid.uuid4()),
                recruiter_id=rid,
                views=50 + i * 23,
                applicants_count=i * 5,
                notify_candidates=True,
                deadline=None,
                **j,
            ))
            print(f"   ✅  {j['title']}  @  {j['company']}")

        await db.commit()

    print("\n" + "=" * 50)
    print("🎉 Seeding complete!\n")
    print("📋 Demo Login Credentials:")
    print("   Student   →  priya@demo.com        /  Demo@1234")
    print("   Student   →  rahul@demo.com        /  Demo@1234")
    print("   Recruiter →  hr@techcorp.demo      /  Demo@1234")
    print("   Recruiter →  hr@aisolutions.demo   /  Demo@1234")
    print("\n▶️  Now run: uvicorn main:app --reload --port 8000")
    print("=" * 50)

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
