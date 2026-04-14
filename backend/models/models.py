"""
SkillSetu — SQLite Models
All database tables defined here.
SQLite creates the file automatically — no setup needed!
"""

from sqlalchemy import Column, String, Boolean, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from config.db import Base


def gen_uuid():
    return str(uuid.uuid4())


# =============================================
# USER
# =============================================
class User(Base):
    __tablename__ = "users"

    id           = Column(String, primary_key=True, default=gen_uuid)
    name         = Column(String(100), nullable=False)
    username     = Column(String(50),  unique=True, nullable=False, index=True)
    email        = Column(String(200), unique=True, nullable=False, index=True)
    phone        = Column(String(15),  nullable=True)
    password_hash= Column(String(200), nullable=False)
    role         = Column(String(20),  nullable=False)
    avatar_url   = Column(String(500), nullable=True)
    is_verified  = Column(Boolean, default=False)
    is_active    = Column(Boolean, default=True)
    google_uid   = Column(String(200), nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)
    updated_at   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student_profile  = relationship("StudentProfile",  back_populates="user", uselist=False)
    recruiter_profile= relationship("RecruiterProfile", back_populates="user", uselist=False)
    sent_messages    = relationship("Message", foreign_keys="Message.sender_id",   back_populates="sender")
    received_messages= relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    notifications    = relationship("Notification", back_populates="user")


# =============================================
# STUDENT PROFILE
# =============================================
class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id               = Column(String, primary_key=True, default=gen_uuid)
    user_id          = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    bio              = Column(Text,        nullable=True)
    location         = Column(String(100), nullable=True)
    portfolio_url    = Column(String(500), nullable=True)
    github_url       = Column(String(500), nullable=True)
    linkedin_url     = Column(String(500), nullable=True)
    career_goal      = Column(String(200), nullable=True)
    suggested_role   = Column(String(200), nullable=True)
    profile_strength = Column(Integer, default=0)

    skills              = Column(JSON, default=list)
    interests           = Column(JSON, default=list)
    education           = Column(JSON, default=list)
    projects            = Column(JSON, default=list)
    achievements        = Column(JSON, default=list)
    certificates        = Column(JSON, default=list)
    uploaded_documents  = Column(JSON, default=list)
    ai_roadmap          = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="student_profile")


# =============================================
# RECRUITER PROFILE
# =============================================
class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id                  = Column(String, primary_key=True, default=gen_uuid)
    user_id             = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    company             = Column(String(200), nullable=False)
    company_description = Column(Text,        nullable=True)
    industry            = Column(String(100), nullable=True)
    company_size        = Column(String(50),  nullable=True)
    website             = Column(String(500), nullable=True)
    location            = Column(String(100), nullable=True)
    logo_url            = Column(String(500), nullable=True)
    is_verified         = Column(Boolean, default=False)
    created_at          = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recruiter_profile")


# =============================================
# JOB
# =============================================
class Job(Base):
    __tablename__ = "jobs"

    id                = Column(String, primary_key=True, default=gen_uuid)
    recruiter_id      = Column(String, ForeignKey("users.id"), nullable=False)
    company           = Column(String(200), nullable=False)
    title             = Column(String(200), nullable=False)
    description       = Column(Text,        nullable=False)
    location          = Column(String(100), nullable=False)
    job_type          = Column(String(50),  nullable=False)
    salary            = Column(String(100), nullable=True)
    experience        = Column(String(50),  nullable=True)
    required_skills   = Column(JSON, default=list)
    perks             = Column(Text,    nullable=True)
    is_remote         = Column(Boolean, default=False)
    urgent            = Column(Boolean, default=False)
    deadline          = Column(String(50), nullable=True)
    is_active         = Column(Boolean, default=True)
    views             = Column(Integer, default=0)
    applicants_count  = Column(Integer, default=0)
    notify_candidates = Column(Boolean, default=True)
    created_at        = Column(DateTime, default=datetime.utcnow)
    updated_at        = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    applications = relationship("Application", back_populates="job")


# =============================================
# APPLICATION
# =============================================
class Application(Base):
    __tablename__ = "applications"

    id            = Column(String, primary_key=True, default=gen_uuid)
    job_id        = Column(String, ForeignKey("jobs.id"),  nullable=False)
    student_id    = Column(String, ForeignKey("users.id"), nullable=False)
    recruiter_id  = Column(String, nullable=False)
    name          = Column(String(100), nullable=False)
    email         = Column(String(200), nullable=False)
    phone         = Column(String(15),  nullable=False)
    cover_letter  = Column(Text,    nullable=True)
    experience    = Column(String(50), nullable=True)
    notice_period = Column(String(50), default="Immediate")
    resume_url    = Column(String(500), nullable=True)
    match_score   = Column(Integer, default=0)
    status        = Column(String(50), default="new")
    notes         = Column(Text, nullable=True)
    applied_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    job = relationship("Job", back_populates="applications")


# =============================================
# MESSAGE
# =============================================
class Message(Base):
    __tablename__ = "messages"

    id              = Column(String, primary_key=True, default=gen_uuid)
    sender_id       = Column(String, ForeignKey("users.id"), nullable=False)
    receiver_id     = Column(String, ForeignKey("users.id"), nullable=False)
    conversation_id = Column(String(200), nullable=False, index=True)
    content         = Column(Text,    nullable=False)
    is_read         = Column(Boolean, default=False)
    sent_at         = Column(DateTime, default=datetime.utcnow)

    sender   = relationship("User", foreign_keys=[sender_id],   back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")


# =============================================
# NOTIFICATION
# =============================================
class Notification(Base):
    __tablename__ = "notifications"

    id             = Column(String, primary_key=True, default=gen_uuid)
    user_id        = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title          = Column(String(300), nullable=False)
    body           = Column(Text,        nullable=False)
    type           = Column(String(50),  nullable=False)
    is_read        = Column(Boolean, default=False)
    link           = Column(String(200), nullable=True)
    whatsapp_sent  = Column(Boolean, default=False)
    sms_sent       = Column(Boolean, default=False)
    email_sent     = Column(Boolean, default=False)
    created_at     = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


# =============================================
# FEEDBACK ✅ NEW
# =============================================
class Feedback(Base):
    __tablename__ = "feedbacks"

    id         = Column(String, primary_key=True, default=gen_uuid)
    user_id    = Column(String, ForeignKey("users.id"), nullable=False)
    user_name  = Column(String(100), nullable=False)
    user_role  = Column(String(20),  nullable=False)
    rating     = Column(Integer, nullable=False)
    message    = Column(Text,    nullable=False)
    is_public  = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)