from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "SkillSetu"
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    # SQLite — just a file, no server needed!
    DATABASE_URL: str = "sqlite+aiosqlite:///./skillsetu.db"

    # JWT
    JWT_SECRET: str = "skillsetu_secret_key_change_this"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 168

    # Google Gemini AI (Free)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # Groq AI (Free fallback)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama3-8b-8192"

    # Twilio (optional)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_FROM: str = "whatsapp:+14155238886"
    TWILIO_SMS_FROM: str = ""

    # Gmail (optional)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    # Cloudinary (optional)
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    model_config = {"env_file": ".env", "extra": "ignore"}
    # ^^^ "extra": "ignore" is the KEY FIX
    # It tells pydantic to IGNORE any unknown keys in .env
    # So VITE_API_URL won't cause an error anymore


settings = Settings()
