"""
Gemini AI Configuration
Gets initialized when GeminiService() is created.
This file just holds the init helper.
"""
import logging
import google.generativeai as genai
from config.settings import settings

logger = logging.getLogger(__name__)


def init_gemini():
    """Initialize Gemini with API key from settings."""
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        logger.info("✅ Gemini AI initialized")
        return True
    else:
        logger.warning("⚠️  GEMINI_API_KEY not set — AI features will use demo/fallback mode")
        return False


def get_gemini_model():
    """Get a Gemini model instance."""
    try:
        return genai.GenerativeModel(settings.GEMINI_MODEL)
    except Exception as e:
        logger.error(f"Could not create Gemini model: {e}")
        return None
