"""
Analyze Router — handles the POST /analyze endpoint.
Accepts multipart/form-data with 10 structured questionnaire answers,
optional additional_context free-text, and optional facial image.
"""

from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from typing import Optional
import logging

from app.utils.validation import validate_image
from app.services.gemini_service import analyze_wellness

router = APIRouter(tags=["Analysis"])

# The 10 structured questions and their valid option labels
QUESTIONS = {
    "q1_mood": {
        "question": "Overall, how would you rate your mood today?",
        "options": ["Very Low", "Low", "Neutral", "Good", "Very Good"],
    },
    "q2_stress": {
        "question": "How often have you felt overwhelmed by stress in the past two weeks?",
        "options": ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
    },
    "q3_sleep": {
        "question": "How has your sleep been lately?",
        "options": ["Much worse than usual", "Slightly worse", "Normal", "Better than usual"],
    },
    "q4_energy": {
        "question": "How are your energy levels?",
        "options": ["Constantly drained", "Often tired", "Normal", "Energetic"],
    },
    "q5_appetite": {
        "question": "Have you noticed any change in appetite recently?",
        "options": ["Eating much less", "Eating less", "No change", "Eating more"],
    },
    "q6_concentration": {
        "question": "How easy is it to concentrate on tasks right now?",
        "options": ["Very difficult", "Somewhat difficult", "Normal", "Easy"],
    },
    "q7_interest": {
        "question": "How much interest do you have in things you usually enjoy?",
        "options": ["None at all", "Less than usual", "Normal", "More than usual"],
    },
    "q8_anxiety": {
        "question": "How often do you feel anxious, nervous, or on edge?",
        "options": ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
    },
    "q9_connection": {
        "question": "How connected do you feel to the people around you?",
        "options": ["Very isolated", "Somewhat isolated", "Normal", "Well connected"],
    },
    "q10_hopelessness": {
        "question": "Have you had thoughts of hopelessness or that things won't get better?",
        "options": ["Never", "Rarely", "Sometimes", "Often"],
    },
}


@router.post("/analyze")
async def analyze(
    q1_mood: str = Form(..., description="Mood rating"),
    q2_stress: str = Form(..., description="Stress frequency"),
    q3_sleep: str = Form(..., description="Sleep quality"),
    q4_energy: str = Form(..., description="Energy levels"),
    q5_appetite: str = Form(..., description="Appetite changes"),
    q6_concentration: str = Form(..., description="Concentration ability"),
    q7_interest: str = Form(..., description="Interest in activities"),
    q8_anxiety: str = Form(..., description="Anxiety frequency"),
    q9_connection: str = Form(..., description="Social connection"),
    q10_hopelessness: str = Form(..., description="Hopelessness frequency"),
    additional_context: Optional[str] = Form("", description="Optional open-ended text"),
    image: Optional[UploadFile] = File(None, description="Optional selfie/facial image"),
):
    """
    Analyze user's emotional wellness using AI.

    Accepts 10 structured questionnaire answers, optional free-text context,
    and an optional facial image. Returns a structured wellness assessment JSON.
    """
    # Validate each answer against its allowed options
    answers = {
        "q1_mood": q1_mood,
        "q2_stress": q2_stress,
        "q3_sleep": q3_sleep,
        "q4_energy": q4_energy,
        "q5_appetite": q5_appetite,
        "q6_concentration": q6_concentration,
        "q7_interest": q7_interest,
        "q8_anxiety": q8_anxiety,
        "q9_connection": q9_connection,
        "q10_hopelessness": q10_hopelessness,
    }

    for key, value in answers.items():
        valid_options = QUESTIONS[key]["options"]
        if value not in valid_options:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid answer for '{QUESTIONS[key]['question']}': '{value}'. Valid options: {valid_options}",
            )

    # Clean optional additional context
    cleaned_context = (additional_context or "").strip()
    if len(cleaned_context) > 5000:
        raise HTTPException(
            status_code=400,
            detail="Additional context is too long. Please keep it under 5000 characters.",
        )

    # Build structured Q&A pairs for Gemini
    qa_pairs = []
    for key, value in answers.items():
        qa_pairs.append({
            "question": QUESTIONS[key]["question"],
            "answer": value,
        })

    # Validate and read image if provided
    image_bytes = None
    image_mime = None
    if image and image.filename:
        image_bytes = await validate_image(image)
        image_mime = image.content_type

    # Determine if safety backstop should be forced
    force_crisis = q10_hopelessness == "Often"

    # Call Gemini for analysis
    try:
        result = await analyze_wellness(
            qa_pairs=qa_pairs,
            additional_context=cleaned_context,
            image_bytes=image_bytes,
            image_mime=image_mime,
            force_crisis=force_crisis,
        )
        return result
    except Exception as e:
        logging.exception("Error in /analyze endpoint:")
        raise HTTPException(
            status_code=500,
            detail=f"We encountered an issue analyzing your input. Please try again. ({str(e)})",
        )
