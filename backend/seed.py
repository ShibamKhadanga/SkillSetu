"""
SkillSetu — Demo Data Seeder  (ALL Career Fields)
Run this from inside the backend/ folder:

    cd backend
    python seed.py

Creates demo accounts across ALL Indian career fields for SIH presentation.
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Fix Windows console encoding
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
import uuid

DATABASE_URL = "sqlite+aiosqlite:///./skillsetu.db"
engine  = create_async_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def seed():
    print("=" * 60)
    print("SkillSetu Seeder — ALL CAREER FIELDS")
    print("=" * 60)

    from models.models import Base, User, StudentProfile, RecruiterProfile, Job
    from utils.jwt_utils import hash_password

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created/verified")

    async with Session() as db:

        # ── Clear old demo data ────────────────────────
        demo_emails = [
            "priya@demo.com", "rahul@demo.com",
            "ananya@demo.com", "arjun@demo.com",
            "kavitha@demo.com", "suresh@demo.com",
            "meera@demo.com", "rohan@demo.com",
            "deepika@demo.com", "aman@demo.com",
            "hr@techcorp.demo", "hr@aisolutions.demo",
            "hr@medicare.demo", "hr@legalfirm.demo",
        ]
        from sqlalchemy import text
        for email in demo_emails:
            # raw SQL to avoid autoflush cascade issues
            await db.execute(text(
                "DELETE FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE email = :e)"
            ), {"e": email})
            await db.execute(text(
                "DELETE FROM recruiter_profiles WHERE user_id IN (SELECT id FROM users WHERE email = :e)"
            ), {"e": email})
            await db.execute(text("DELETE FROM users WHERE email = :e"), {"e": email})
        await db.commit()
        print("Old demo data cleared")

        # ══════════════════════════════════════════════
        # STUDENTS — ALL CAREER FIELDS
        # ══════════════════════════════════════════════
        print("\n👨‍🎓 Creating students across ALL fields...")

        students = [
            # ── CS / IT ───────────────────────────────
            {
                "name": "Priya Sharma", "username": "priya_sharma",
                "email": "priya@demo.com", "phone": "9876543210",
                "skills": ["React", "Node.js", "MongoDB", "Python", "Git", "AWS", "Docker"],
                "education": [{"degree": "B.Tech Computer Science", "institution": "IIT Bombay", "year": "2024", "cgpa": "8.9"}],
                "bio": "Full stack developer passionate about building scalable web apps. Winner SIH 2023.",
                "location": "Bangalore", "career_goal": "Full Stack Developer",
                "interests": ["Web Development", "Cloud Computing"],
                "achievements": ["Winner - Smart India Hackathon 2023", "Google Code Jam Top 100"],
                "projects": [
                    {"name": "SkillSetu", "description": "AI career bridge platform connecting 10k+ students", "tech": "React, FastAPI, Gemini AI"},
                    {"name": "E-Commerce App", "description": "Full-stack shopping platform with 1000+ users", "tech": "React, Node.js, MongoDB"},
                ],
            },
            {
                "name": "Rahul Verma", "username": "rahul_verma",
                "email": "rahul@demo.com", "phone": "9876543211",
                "skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "Pandas", "Scikit-learn", "NLP"],
                "education": [{"degree": "B.Tech IT", "institution": "NIT Warangal", "year": "2024", "cgpa": "8.5"}],
                "bio": "ML enthusiast building intelligent systems. Kaggle Expert. Published IEEE paper.",
                "location": "Hyderabad", "career_goal": "Data Scientist",
                "interests": ["Machine Learning", "Data Science"],
                "achievements": ["Kaggle Expert", "Published ML paper in IEEE 2023"],
                "projects": [
                    {"name": "Price Predictor", "description": "ML model predicting house prices with 94% accuracy", "tech": "Python, Scikit-learn, Pandas"},
                    {"name": "NLP Sentiment Analyzer", "description": "Real-time social media sentiment analysis tool", "tech": "Python, BERT, FastAPI"},
                ],
            },
            # ── COMMERCE / CA ─────────────────────────
            {
                "name": "Ananya Gupta", "username": "ananya_gupta",
                "email": "ananya@demo.com", "phone": "9876543212",
                "skills": ["Accounting", "Taxation", "Tally ERP", "MS Excel", "GST Filing", "Financial Analysis", "Auditing"],
                "education": [
                    {"degree": "CA Intermediate", "institution": "ICAI", "year": "2024", "cgpa": ""},
                    {"degree": "B.Com Hons", "institution": "Delhi University", "year": "2023", "cgpa": "8.2"},
                ],
                "bio": "CA Intermediate cleared. Passionate about finance and tax consulting. 2 years articleship at Big 4.",
                "location": "Delhi", "career_goal": "Chartered Accountant",
                "interests": ["Finance & Accounting", "Taxation"],
                "achievements": ["CA Foundation All India Rank 45", "Best Student Award — DU 2023"],
                "projects": [
                    {"name": "GST Reconciliation Tool", "description": "Automated GST reconciliation system for SMEs, reduced errors by 80%", "tech": "Python, Excel VBA, Tally API"},
                    {"name": "Personal Finance App", "description": "Mobile-friendly budgeting app for college students", "tech": "React, Firebase"},
                ],
            },
            {
                "name": "Arjun Patel", "username": "arjun_patel",
                "email": "arjun@demo.com", "phone": "9876543213",
                "skills": ["Financial Modeling", "DCF Valuation", "Bloomberg", "PowerPoint", "Excel", "MBA Finance", "Investment Research"],
                "education": [{"degree": "MBA Finance", "institution": "IIM Ahmedabad", "year": "2024", "cgpa": "3.8/4"}],
                "bio": "IIM-A MBA Finance. Interned at Goldman Sachs and Kotak Investment Banking. Passionate about capital markets.",
                "location": "Mumbai", "career_goal": "Investment Banker",
                "interests": ["Finance & Accounting", "Business Analyst"],
                "achievements": ["Goldman Sachs Scholarship 2023", "CFA Level 1 Cleared"],
                "projects": [
                    {"name": "Stock Screener", "description": "Automated equity screener using fundamental analysis", "tech": "Python, Yahoo Finance API, Streamlit"},
                    {"name": "Startup Valuation Model", "description": "DCF + Comparable analysis for Series A startups", "tech": "Excel, Python"},
                ],
            },
            # ── MEDICAL / HEALTHCARE ──────────────────
            {
                "name": "Kavitha Reddy", "username": "kavitha_reddy",
                "email": "kavitha@demo.com", "phone": "9876543214",
                "skills": ["Clinical Medicine", "Patient Care", "MBBS", "Emergency Care", "Pharmacology", "Surgery Basics", "Medical Research"],
                "education": [{"degree": "MBBS", "institution": "AIIMS Delhi", "year": "2024", "cgpa": ""}],
                "bio": "MBBS from AIIMS Delhi. Interested in cardiology and medical research. 1 year internship at AIIMS.",
                "location": "Delhi", "career_goal": "Specialist Doctor",
                "interests": ["Medicine & Healthcare"],
                "achievements": ["AIIMS Entrance Rank 47", "Best Intern Award 2024", "Published in JAMA"],
                "projects": [
                    {"name": "Telemedicine App", "description": "Built telemedicine platform for rural healthcare access — 5000+ patients served", "tech": "React Native, Firebase, Python"},
                    {"name": "ECG Anomaly Detector", "description": "ML model detecting cardiac anomalies from ECG with 91% accuracy", "tech": "Python, TensorFlow, PyTorch"},
                ],
            },
            {
                "name": "Suresh Kumar", "username": "suresh_kumar",
                "email": "suresh@demo.com", "phone": "9876543215",
                "skills": ["B.Sc Nursing", "Patient Care", "IV Administration", "ICU Care", "Medical Records", "First Aid", "Phlebotomy"],
                "education": [{"degree": "B.Sc Nursing", "institution": "CMC Vellore", "year": "2024", "cgpa": "8.1"}],
                "bio": "Registered Nurse from CMC Vellore. Experienced in ICU and critical care. Looking for govt hospital positions.",
                "location": "Chennai", "career_goal": "Staff Nurse",
                "interests": ["Medicine & Healthcare"],
                "achievements": ["Gold Medal - CMC Nursing 2024", "Best Clinical Student Award"],
                "projects": [
                    {"name": "Patient Monitoring Dashboard", "description": "Digital patient vitals tracking system for ward nurses", "tech": "React, Node.js, IoT sensors"},
                ],
            },
            # ── ARTS / LAW / UPSC ─────────────────────
            {
                "name": "Meera Nair", "username": "meera_nair",
                "email": "meera@demo.com", "phone": "9876543216",
                "skills": ["Constitutional Law", "Criminal Law", "Legal Research", "Moot Court", "Contract Drafting", "Corporate Law", "CLAT"],
                "education": [{"degree": "BA LLB Hons", "institution": "NLSIU Bangalore", "year": "2024", "cgpa": "8.7"}],
                "bio": "Law graduate from NLSIU. Specialize in corporate and constitutional law. Won 3 national moot court competitions.",
                "location": "Bangalore", "career_goal": "Corporate Counsel",
                "interests": ["Law"],
                "achievements": ["Winner - NLSIU Moot Court 2023", "Bar Council Gold Medal", "Amity Law Journal Publication"],
                "projects": [
                    {"name": "LegalEase", "description": "AI-powered legal document summarizer for laypeople", "tech": "Python, NLP, Streamlit"},
                    {"name": "Case Law Database", "description": "Searchable database of 50,000+ Supreme Court judgments", "tech": "PostgreSQL, Elasticsearch, React"},
                ],
            },
            {
                "name": "Rohan Mishra", "username": "rohan_mishra",
                "email": "rohan@demo.com", "phone": "9876543217",
                "skills": ["General Studies", "Essay Writing", "Current Affairs", "Political Science", "History", "Ethics", "Geography"],
                "education": [
                    {"degree": "MA Political Science", "institution": "JNU Delhi", "year": "2023", "cgpa": "8.4"},
                    {"degree": "BA Hons Political Science", "institution": "Delhi University", "year": "2021", "cgpa": "8.8"},
                ],
                "bio": "UPSC aspirant. Cleared Prelims 2023. Preparing for Mains. Passionate about public policy and governance.",
                "location": "Delhi", "career_goal": "IAS Officer",
                "interests": ["Teaching & Education", "Law"],
                "achievements": ["UPSC Prelims 2023 Cleared", "UGC NET Qualified", "State Civil Services Officer - 2022"],
                "projects": [
                    {"name": "UPSC Prep Platform", "description": "Free online UPSC preparation resources for rural aspirants — 10k users", "tech": "React, Node.js, MongoDB"},
                ],
            },
            # ── TEACHING / EDUCATION ──────────────────
            {
                "name": "Deepika Joshi", "username": "deepika_joshi",
                "email": "deepika@demo.com", "phone": "9876543218",
                "skills": ["Mathematics Teaching", "CBSE Curriculum", "Lesson Planning", "Student Assessment", "Educational Technology", "Classroom Management", "CTET"],
                "education": [
                    {"degree": "M.Sc Mathematics", "institution": "BHU Varanasi", "year": "2023", "cgpa": "8.6"},
                    {"degree": "B.Ed", "institution": "Delhi University", "year": "2024", "cgpa": ""},
                ],
                "bio": "CTET qualified mathematics teacher. 2 years experience at CBSE school. Passionate about making math fun for students.",
                "location": "Lucknow", "career_goal": "School Teacher",
                "interests": ["Teaching & Education"],
                "achievements": ["CTET Qualified 2023", "Best Teacher Award - Ryan International 2023"],
                "projects": [
                    {"name": "MathsEasy", "description": "Interactive mathematics learning app for Class 6-10 students", "tech": "React, Firebase, Canvas API"},
                    {"name": "Digital Whiteboard", "description": "Collaborative online teaching whiteboard for remote classes", "tech": "React, WebRTC, Socket.io"},
                ],
            },
            # ── ITI / DIPLOMA ─────────────────────────
            {
                "name": "Aman Singh", "username": "aman_singh",
                "email": "aman@demo.com", "phone": "9876543219",
                "skills": ["Electrical Wiring", "PLC Programming", "Motor Control", "AutoCAD Electrical", "Industrial Automation", "SCADA", "Safety Standards"],
                "education": [
                    {"degree": "Diploma Electrical Engineering", "institution": "Govt Polytechnic Pune", "year": "2024", "cgpa": "78%"},
                    {"degree": "ITI Electrician", "institution": "ITI Pune", "year": "2022", "cgpa": ""},
                ],
                "bio": "Diploma electrician with strong hands-on skills. PLC certified. Looking for industrial automation roles in Pune manufacturing sector.",
                "location": "Pune", "career_goal": "Industrial Electrician",
                "interests": ["Embedded Systems"],
                "achievements": ["Best Student Award - Govt Polytechnic 2024", "NCVT Certified Electrician"],
                "projects": [
                    {"name": "Smart Factory Monitor", "description": "IoT-based real-time monitoring system for factory equipment", "tech": "Arduino, Raspberry Pi, MQTT, React"},
                    {"name": "Home Automation System", "description": "Voice-controlled home automation using Alexa + custom hardware", "tech": "ESP32, AWS IoT, Alexa Skills"},
                ],
            },
        ]

        student_ids = {}
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
                career_goal=s.get("career_goal"),
                skills=s["skills"], interests=s["interests"],
                education=s["education"], projects=s["projects"],
                achievements=s["achievements"],
                certificates=[], uploaded_documents=[],
                profile_strength=80 + len(s["skills"]) * 2,
                suggested_role=s.get("career_goal", s["interests"][0]),
            ))
            student_ids[s["email"]] = uid
            print(f"   ✅  {s['name']:25s}  {s['career_goal']:30s}  {s['email']}")

        # ══════════════════════════════════════════════
        # RECRUITERS
        # ══════════════════════════════════════════════
        print("\n🏢 Creating recruiters...")

        recruiters = [
            {
                "name": "TechCorp HR", "username": "techcorp_hr",
                "email": "hr@techcorp.demo", "phone": "9876540001",
                "company": "TechCorp India Pvt Ltd", "industry": "Software", "location": "Bangalore",
                "description": "India's leading software product company with 5000+ employees across Bangalore, Hyderabad and Pune.",
            },
            {
                "name": "AI Solutions HR", "username": "aisolutions_hr",
                "email": "hr@aisolutions.demo", "phone": "9876540002",
                "company": "AI Solutions Pvt Ltd", "industry": "AI/ML", "location": "Hyderabad",
                "description": "Building the next generation of AI products for enterprise. 100% remote-friendly culture.",
            },
            {
                "name": "MediCare HR", "username": "medicare_hr",
                "email": "hr@medicare.demo", "phone": "9876540003",
                "company": "MediCare Hospitals", "industry": "Healthcare", "location": "Delhi",
                "description": "Top 5 hospital chain in India with 50+ hospitals across 25 cities. Hiring doctors, nurses and healthcare staff.",
            },
            {
                "name": "LegalFirm HR", "username": "legalfirm_hr",
                "email": "hr@legalfirm.demo", "phone": "9876540004",
                "company": "Khaitan & Associates LLP", "industry": "Legal", "location": "Mumbai",
                "description": "One of India's premier law firms specializing in corporate, M&A and tax law.",
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
                location=r["location"],
                company_description=r.get("description", ""),
                is_verified=True,
            ))
            recruiter_ids.append(uid)
            print(f"   ✅  {r['name']:25s}  {r['company']}")

        await db.commit()

        # ══════════════════════════════════════════════
        # JOBS — ALL FIELDS
        # ══════════════════════════════════════════════
        print("\n💼 Creating jobs across ALL fields...")

        jobs = [
            # ── Tech / IT ─────────────────────────────
            {
                "title": "Full Stack Developer",
                "company": "TechCorp India Pvt Ltd",
                "description": "Build scalable web applications using React and Node.js. Work with a talented team on cutting-edge products. Freshers welcome.",
                "location": "Bangalore", "job_type": "full-time",
                "salary": "₹8-12 LPA", "experience": "fresher",
                "required_skills": ["React", "Node.js", "MongoDB", "Git", "TypeScript"],
                "is_remote": False, "urgent": True, "min_education": "B.Tech",
                "perks": "Health insurance, MacBook, Free lunch, 5-day week",
                "recruiter_idx": 0,
            },
            {
                "title": "Machine Learning Engineer",
                "company": "AI Solutions Pvt Ltd",
                "description": "Build production ML models impacting millions. Work on NLP, computer vision and recommendation systems.",
                "location": "Remote", "job_type": "full-time",
                "salary": "₹12-18 LPA", "experience": "1",
                "required_skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "MLOps"],
                "is_remote": True, "urgent": False, "min_education": "B.Tech",
                "perks": "100% remote, Flexible hours, Stock options, Learning budget ₹50k",
                "recruiter_idx": 1,
            },
            {
                "title": "Python Backend Developer",
                "company": "TechCorp India Pvt Ltd",
                "description": "Design and build high-performance REST APIs using FastAPI and Django. Work with microservices architecture.",
                "location": "Pune", "job_type": "full-time",
                "salary": "₹10-15 LPA", "experience": "1",
                "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "Redis"],
                "is_remote": False, "urgent": False, "min_education": "B.Tech",
                "perks": "PF, Gratuity, Health insurance, Annual bonus",
                "recruiter_idx": 0,
            },
            {
                "title": "Data Scientist",
                "company": "AI Solutions Pvt Ltd",
                "description": "Apply machine learning to solve real-world business problems. Build dashboards and models for C-suite insights.",
                "location": "Hyderabad", "job_type": "full-time",
                "salary": "₹10-16 LPA", "experience": "fresher",
                "required_skills": ["Python", "SQL", "Pandas", "Scikit-learn", "Power BI", "Statistics"],
                "is_remote": True, "urgent": False, "min_education": "B.Tech",
                "perks": "Flexible hours, Remote-first, Learning stipend",
                "recruiter_idx": 1,
            },
            {
                "title": "Frontend Developer — React (Intern)",
                "company": "TechCorp India Pvt Ltd",
                "description": "Work directly with product founders building the next big SaaS product. PPO opportunity for top performers.",
                "location": "Bangalore", "job_type": "internship",
                "salary": "₹25,000/month", "experience": "fresher",
                "required_skills": ["React", "JavaScript", "CSS", "HTML", "Figma"],
                "is_remote": False, "urgent": True, "min_education": "B.Sc",
                "perks": "PPO for top performers, Mentorship from IIT/IIM alumni",
                "recruiter_idx": 0,
            },
            # ── Commerce / Finance ────────────────────
            {
                "title": "Chartered Accountant — Tax & Compliance",
                "company": "Khaitan & Associates LLP",
                "description": "Handle direct and indirect tax compliance for 50+ corporate clients. Lead a team of 3 junior associates.",
                "location": "Mumbai", "job_type": "full-time",
                "salary": "₹10-18 LPA", "experience": "1",
                "required_skills": ["Accounting", "Taxation", "GST Filing", "Income Tax", "Auditing", "Tally ERP", "CA Qualification"],
                "is_remote": False, "urgent": False, "min_education": "CA",
                "perks": "Annual bonus, Health insurance, CA study leave",
                "recruiter_idx": 3,
            },
            {
                "title": "Finance Analyst — Investment Banking",
                "company": "Khaitan & Associates LLP",
                "description": "Support M&A transactions, prepare pitch books and financial models. Great exposure to deal-making.",
                "location": "Mumbai", "job_type": "full-time",
                "salary": "₹12-20 LPA", "experience": "fresher",
                "required_skills": ["Financial Modeling", "DCF Valuation", "Excel", "PowerPoint", "Investment Research", "MBA Finance"],
                "is_remote": False, "urgent": True, "min_education": "MBA",
                "perks": "Performance bonus up to 100%, International travel, Fast promotion track",
                "recruiter_idx": 3,
            },
            {
                "title": "Accounts Executive",
                "company": "TechCorp India Pvt Ltd",
                "description": "Manage day-to-day accounting, vendor payments, TDS filings. Work with Big 4 auditors.",
                "location": "Bangalore", "job_type": "full-time",
                "salary": "₹4-7 LPA", "experience": "fresher",
                "required_skills": ["Accounting", "Tally ERP", "MS Excel", "GST Filing", "Taxation"],
                "is_remote": False, "urgent": False, "min_education": "B.Com",
                "perks": "PF, Health insurance, Annual appraisal",
                "recruiter_idx": 0,
            },
            # ── Medical / Healthcare ──────────────────
            {
                "title": "MBBS Doctor — General Physician",
                "company": "MediCare Hospitals",
                "description": "Join our network of 50 hospitals across India. Manage OPD, emergency cases and patient rounds.",
                "location": "Delhi", "job_type": "full-time",
                "salary": "₹10-16 LPA", "experience": "fresher",
                "required_skills": ["Clinical Medicine", "Patient Care", "MBBS", "Pharmacology", "Emergency Care"],
                "is_remote": False, "urgent": True, "min_education": "MBBS",
                "perks": "Accommodation, PG education sponsorship, CME credits",
                "recruiter_idx": 2,
            },
            {
                "title": "Staff Nurse — ICU / CCU",
                "company": "MediCare Hospitals",
                "description": "Manage critical care patients in our state-of-the-art ICU. Night shift allowance provided.",
                "location": "Delhi", "job_type": "full-time",
                "salary": "₹4-7 LPA", "experience": "fresher",
                "required_skills": ["B.Sc Nursing", "ICU Care", "Patient Care", "IV Administration", "Medical Records"],
                "is_remote": False, "urgent": True, "min_education": "B.Sc Nursing",
                "perks": "Accommodation, Night shift allowance, PF, Medical benefits",
                "recruiter_idx": 2,
            },
            {
                "title": "Healthcare Data Analyst",
                "company": "MediCare Hospitals",
                "description": "Analyze clinical data to improve patient outcomes. Work with doctors and tech team to build dashboards.",
                "location": "Remote", "job_type": "full-time",
                "salary": "₹6-10 LPA", "experience": "fresher",
                "required_skills": ["SQL", "Python", "Power BI", "Medical Research", "Excel", "Statistics"],
                "is_remote": True, "urgent": False, "min_education": "B.Sc",
                "perks": "100% remote, Flexible hours",
                "recruiter_idx": 2,
            },
            # ── Legal ─────────────────────────────────
            {
                "title": "Associate Lawyer — Corporate & M&A",
                "company": "Khaitan & Associates LLP",
                "description": "Draft and review commercial contracts, work on M&A transactions and corporate restructuring.",
                "location": "Mumbai", "job_type": "full-time",
                "salary": "₹8-14 LPA", "experience": "fresher",
                "required_skills": ["Corporate Law", "Contract Drafting", "Constitutional Law", "Legal Research", "Moot Court", "BA LLB"],
                "is_remote": False, "urgent": False, "min_education": "LLB",
                "perks": "Bar Council registration support, Annual bonus",
                "recruiter_idx": 3,
            },
            {
                "title": "Legal Intern — IP & Technology Law",
                "company": "TechCorp India Pvt Ltd",
                "description": "Assist in-house legal team with IP filings, vendor contracts and data privacy compliance under DPDP Act.",
                "location": "Bangalore", "job_type": "internship",
                "salary": "₹20,000/month", "experience": "fresher",
                "required_skills": ["Constitutional Law", "Legal Research", "Contract Drafting", "Cyber Law"],
                "is_remote": False, "urgent": False, "min_education": "LLB",
                "perks": "PPO opportunity, Learn from top in-house counsel",
                "recruiter_idx": 0,
            },
            # ── Teaching ──────────────────────────────
            {
                "title": "Mathematics Teacher — CBSE (Classes 9-12)",
                "company": "TechCorp India Pvt Ltd",  # reusing for demo
                "description": "Teach Mathematics to CBSE Classes 9-12. Use EdTech tools and flipped classroom methods.",
                "location": "Bangalore", "job_type": "full-time",
                "salary": "₹5-8 LPA", "experience": "fresher",
                "required_skills": ["Mathematics Teaching", "CBSE Curriculum", "Lesson Planning", "CTET", "Educational Technology"],
                "is_remote": False, "urgent": False, "min_education": "B.Ed",
                "perks": "Summer vacation, Provident Fund, School accommodation",
                "recruiter_idx": 0,
            },
            # ── Govt / Defence ────────────────────────
            {
                "title": "SSC CGL — Tax Assistant / Auditor",
                "company": "Govt of India — SSC CGL 2024",
                "description": "Central Government Grade B gazetted officer roles. Income Tax Department, CAG, CGA and more.",
                "location": "All India", "job_type": "full-time",
                "salary": "₹6-12 LPA + DA + HRA", "experience": "fresher",
                "required_skills": ["General Studies", "Accounting", "Taxation", "Quantitative Aptitude", "English"],
                "is_remote": False, "urgent": True, "min_education": "Graduate",
                "perks": "Job security, Pension, Healthcare, Housing allowance",
                "recruiter_idx": 0,
            },
            {
                "title": "Industrial Electrician — Automation Plant",
                "company": "TechCorp India Pvt Ltd",
                "description": "Maintain and install electrical systems in our Pune manufacturing facility. PLC programming experience preferred.",
                "location": "Pune", "job_type": "full-time",
                "salary": "₹3-6 LPA", "experience": "fresher",
                "required_skills": ["Electrical Wiring", "PLC Programming", "Motor Control", "AutoCAD Electrical", "Industrial Automation", "Safety Standards"],
                "is_remote": False, "urgent": False, "min_education": "ITI",
                "perks": "PF, ESI, Uniform, Canteen, Shift allowance",
                "recruiter_idx": 0,
            },
        ]

        for idx, j in enumerate(jobs):
            ridx = j.pop("recruiter_idx")
            j.pop("min_education", None)   # not a DB field
            rid  = recruiter_ids[ridx % len(recruiter_ids)]
            db.add(Job(
                id=str(uuid.uuid4()),
                recruiter_id=rid,
                views=50 + idx * 17,
                applicants_count=idx * 3,
                notify_candidates=True,
                deadline=None,
                **j,
            ))
            print(f"   OK  {j['title'][:45]:50s}  {j['salary']}")


        await db.commit()

    print("\n" + "=" * 60)
    print("🎉 Seeding complete!\n")
    print("📋 Demo Login Credentials (password: Demo@1234 for ALL):")
    print()
    print("  👩‍💻 CS/IT Students:")
    print("     priya@demo.com       — Full Stack Developer (React/Node/AWS)")
    print("     rahul@demo.com       — Data Scientist (ML/Python/TensorFlow)")
    print()
    print("  📊 Commerce/Finance Students:")
    print("     ananya@demo.com      — CA Intermediate (Tax/Auditing/Tally)")
    print("     arjun@demo.com       — MBA Finance (IB/Valuation/CFA)")
    print()
    print("  🏥 Healthcare Students:")
    print("     kavitha@demo.com     — MBBS Doctor (AIIMS)")
    print("     suresh@demo.com      — BSc Nursing (CMC Vellore)")
    print()
    print("  ⚖️  Arts/Law Students:")
    print("     meera@demo.com       — Corporate Lawyer (NLSIU)")
    print("     rohan@demo.com       — UPSC Aspirant (IAS)")
    print()
    print("  🎓 Teaching Students:")
    print("     deepika@demo.com     — CTET Mathematics Teacher")
    print()
    print("  🔧 ITI/Diploma Students:")
    print("     aman@demo.com        — Industrial Electrician (PLC)")
    print()
    print("  🏢 Recruiters:")
    print("     hr@techcorp.demo      — TechCorp India")
    print("     hr@aisolutions.demo   — AI Solutions")
    print("     hr@medicare.demo      — MediCare Hospitals")
    print("     hr@legalfirm.demo    — Khaitan & Associates LLP")
    print()
    print("▶️  Now run: uvicorn main:app --reload --port 8000")
    print("=" * 60)

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
