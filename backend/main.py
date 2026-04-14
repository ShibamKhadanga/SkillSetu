"""
SkillSetu Backend — FastAPI + SQLite
Kaushal se Rojgar tak 🌉

Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import logging

from config.db import connect_db, disconnect_db
from config.settings import settings

from routes.auth_routes         import router as auth_router
from routes.student_routes      import router as student_router
from routes.recruiter_routes    import router as recruiter_router
from routes.job_routes          import router as job_router
from routes.application_routes  import router as application_router
from routes.ai_routes           import router as ai_router
from routes.message_routes      import router as message_router
from routes.notification_routes import router as notification_router
from routes.feedback_routes     import router as feedback_router   # ✅ NEW

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 SkillSetu API starting up...")
    await connect_db()
    yield
    logger.info("👋 Shutting down...")
    await disconnect_db()


app = FastAPI(
    title="SkillSetu API",
    description="Kaushal se Rojgar tak — AI-powered career bridge platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(auth_router,         prefix="/auth",          tags=["Auth"])
app.include_router(student_router,      prefix="/student",       tags=["Student"])
app.include_router(recruiter_router,    prefix="/recruiter",     tags=["Recruiter"])
app.include_router(job_router,          prefix="/jobs",          tags=["Jobs"])
app.include_router(application_router,  prefix="/applications",  tags=["Applications"])
app.include_router(ai_router,           prefix="/ai",            tags=["AI"])
app.include_router(message_router,      prefix="/messages",      tags=["Messages"])
app.include_router(notification_router, prefix="/notifications", tags=["Notifications"])
app.include_router(feedback_router,     prefix="/feedback",      tags=["Feedback"])   # ✅ NEW


@app.get("/", tags=["Health"])
async def root():
    return {
        "app":      "SkillSetu",
        "tagline":  "Kaushal se Rojgar tak 🌉",
        "database": "SQLite  (skillsetu.db)",
        "status":   "running ✅",
        "docs":     "http://localhost:8000/docs",
    }

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "db": "SQLite"}