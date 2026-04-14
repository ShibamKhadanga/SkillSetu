"""
Cloudinary Configuration — File Upload Service
Free tier: 25GB storage, 25GB bandwidth/month
Sign up at: https://cloudinary.com (free)

If not configured, file uploads will just save the filename locally.
"""
import logging
from config.settings import settings

logger = logging.getLogger(__name__)


def init_cloudinary():
    """Initialize Cloudinary if credentials are set."""
    if not settings.CLOUDINARY_CLOUD_NAME:
        logger.warning("⚠️  Cloudinary not configured — file uploads in demo mode")
        return False
    try:
        import cloudinary
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )
        logger.info("✅ Cloudinary initialized")
        return True
    except ImportError:
        logger.warning("Cloudinary package not installed")
        return False


async def upload_file(file_bytes: bytes, filename: str, folder: str = "skillsetu") -> dict:
    """
    Upload a file to Cloudinary.
    Returns dict with 'url' and 'public_id'.
    Falls back gracefully if Cloudinary is not configured.
    """
    if not settings.CLOUDINARY_CLOUD_NAME:
        # Demo mode — return a fake URL
        return {
            "url": f"demo://uploads/{folder}/{filename}",
            "public_id": f"{folder}/{filename}",
            "format": filename.split(".")[-1],
            "size": len(file_bytes),
        }

    try:
        import cloudinary.uploader
        result = cloudinary.uploader.upload(
            file_bytes,
            public_id=filename.rsplit(".", 1)[0],  # remove extension
            folder=folder,
            resource_type="auto",
        )
        return {
            "url":       result["secure_url"],
            "public_id": result["public_id"],
            "format":    result.get("format"),
            "size":      result.get("bytes"),
        }
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {e}")
        return {
            "url": f"upload-failed://{filename}",
            "public_id": filename,
        }


async def delete_file(public_id: str) -> bool:
    """Delete a file from Cloudinary."""
    try:
        import cloudinary.uploader
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception:
        return False
