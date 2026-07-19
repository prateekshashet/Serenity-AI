"""
Input validation utilities for text and image inputs.
"""

from fastapi import HTTPException, UploadFile

# Constraints
MAX_TEXT_LENGTH = 5000
MIN_TEXT_LENGTH = 10
MAX_IMAGE_SIZE_MB = 5
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


def validate_text(text: str) -> str:
    """Validate and clean the user's text input."""
    cleaned = text.strip()
    if not cleaned:
        raise HTTPException(
            status_code=400,
            detail="Please describe how you're feeling. The text field cannot be empty.",
        )
    if len(cleaned) < MIN_TEXT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Please provide at least {MIN_TEXT_LENGTH} characters so we can give you a meaningful assessment.",
        )
    if len(cleaned) > MAX_TEXT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Text is too long. Please keep it under {MAX_TEXT_LENGTH} characters.",
        )
    return cleaned


async def validate_image(image: UploadFile) -> bytes:
    """Validate image type and size, return raw bytes."""
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image format '{image.content_type}'. Please upload a JPEG, PNG, WebP, or GIF.",
        )
    contents = await image.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_IMAGE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"Image is too large ({size_mb:.1f} MB). Maximum allowed size is {MAX_IMAGE_SIZE_MB} MB.",
        )
    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image appears to be empty or corrupted.",
        )
    return contents
