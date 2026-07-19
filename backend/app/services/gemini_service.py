"""
Gemini AI Service — builds prompts, calls Gemini (text-only or text+vision),
parses and validates the structured JSON response.
"""

import json
import os
import google.generativeai as genai
from PIL import Image
import io

from dotenv import load_dotenv
load_dotenv(override=True)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# The system prompt that enforces responsible AI behavior
SYSTEM_PROMPT = """You are an empathetic emotional wellness assistant for Serenity AI. Your role is to analyze a user's self-reported feelings and, optionally, a facial image to produce a structured emotional wellness assessment.

CRITICAL RULES:
- You are NOT a doctor. NEVER diagnose any disease or medical condition.
- NEVER prescribe medication or specific treatments.
- NEVER claim certainty about a user's mental state — always use language like "may indicate", "appears to suggest", "could be experiencing".
- Always recommend professional help when stress or distress is moderate-to-high.
- If you detect ANY indicators of severe distress, self-harm, suicidal ideation, or crisis language, you MUST set crisis_flag to true.
- When an image is provided, analyze facial expression as SUPPORTIVE context only. The user's written text is the PRIMARY source of truth. Never let image analysis override or contradict what the user explicitly wrote.
- If no image is provided, analyze text only.
- This tool is for emotional support and awareness ONLY. Always include a reminder that it does not replace professional mental healthcare.

You MUST respond with ONLY valid JSON (no markdown, no code fences, no extra text) in exactly this schema:
{
  "emotional_state": "A 2-3 sentence description of the detected emotional state",
  "stress_level": an integer from 0 to 100,
  "burnout_risk": an integer from 0 to 100,
  "possible_indicators": "A comma-separated list of 3-5 emotional indicators detected",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"],
  "professional_help": "A brief recommendation about whether professional help should be considered",
  "summary": "A 2-3 sentence overall wellness summary",
  "crisis_flag": false
}

For stress_level and burnout_risk, use integers:
- 0-25: Low
- 26-50: Moderate
- 51-75: High
- 76-100: Severe/Critical

Err toward caution: if in doubt, set crisis_flag to true rather than false.
Always provide exactly 5 actionable, personalized suggestions based on the user's specific situation.
"""


async def analyze_wellness(qa_pairs: list, additional_context: str, image_bytes: bytes = None, image_mime: str = None, force_crisis: bool = False) -> dict:
    """
    Analyze user's emotional wellness using Gemini.
    """
    model = genai.GenerativeModel(
        model_name="gemini-flash-latest",
        system_instruction=SYSTEM_PROMPT,
    )

    # Build the user prompt
    user_prompt = "Please analyze the following self-reported emotional state and produce a structured wellness assessment:\n\n"
    user_prompt += "### User's Wellness Questionnaire Responses:\n"
    for pair in qa_pairs:
        user_prompt += f"- {pair['question']}: {pair['answer']}\n"
    
    if additional_context:
        user_prompt += f"\n### Additional Context:\n\"{additional_context}\"\n"

    if image_bytes and image_mime:
        user_prompt += "\n\nThe user has also provided a facial image for additional emotional context. Analyze their facial expression as supportive context alongside their written description."
        # Create image part for Gemini vision
        image = Image.open(io.BytesIO(image_bytes))
        contents = [user_prompt, image]
    else:
        user_prompt += "\n\nNo image was provided. Analyze based on text only."
        contents = [user_prompt]

    try:
        response = await model.generate_content_async(contents)
        response_text = response.text.strip()

        # Clean up response — remove markdown code fences if present
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            # Remove first and last lines (code fences)
            lines = [l for l in lines if not l.strip().startswith("```")]
            response_text = "\n".join(lines)

        result = json.loads(response_text)

        # Validate and normalize the response
        result = _validate_response(result)
        
        if force_crisis:
            result["crisis_flag"] = True
            
        return result

    except json.JSONDecodeError:
        # If Gemini returns malformed JSON, return a safe fallback
        return _fallback_response()
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")


def _validate_response(data: dict) -> dict:
    """Validate and normalize the Gemini response to ensure all required fields exist."""
    required_fields = {
        "emotional_state": "Unable to determine emotional state at this time.",
        "stress_level": 50,
        "burnout_risk": 50,
        "possible_indicators": "General emotional fluctuation",
        "suggestions": [
            "Take a few deep breaths and ground yourself",
            "Consider talking to someone you trust",
            "Try journaling your thoughts and feelings",
            "Engage in a physical activity you enjoy",
            "Ensure you're getting adequate rest and nutrition",
        ],
        "professional_help": "If you're feeling overwhelmed, consider reaching out to a mental health professional.",
        "summary": "Based on your input, it appears you may be experiencing some emotional challenges. Please consider the suggestions provided.",
        "crisis_flag": False,
    }

    for field, default in required_fields.items():
        if field not in data:
            data[field] = default

    # Ensure stress_level and burnout_risk are integers 0-100
    for field in ("stress_level", "burnout_risk"):
        try:
            val = int(data[field])
            data[field] = max(0, min(100, val))
        except (ValueError, TypeError):
            data[field] = 50

    # Ensure suggestions is a list of strings
    if not isinstance(data["suggestions"], list):
        data["suggestions"] = [str(data["suggestions"])]

    # Ensure crisis_flag is a boolean
    data["crisis_flag"] = bool(data.get("crisis_flag", False))

    return data


def _fallback_response() -> dict:
    """Return a safe fallback response when Gemini fails to return valid JSON."""
    return {
        "emotional_state": "We were unable to fully process your input, but we acknowledge your feelings.",
        "stress_level": 50,
        "burnout_risk": 50,
        "possible_indicators": "Emotional expression detected",
        "suggestions": [
            "Take a moment to breathe deeply and center yourself",
            "Consider reaching out to a friend or family member",
            "Try writing down your thoughts in a journal",
            "Engage in light physical activity like a short walk",
            "If you're feeling overwhelmed, please contact a mental health professional",
        ],
        "professional_help": "We recommend speaking with a licensed mental health professional for personalized guidance.",
        "summary": "While our AI analysis encountered a temporary issue, your feelings are valid and important. Please consider the general wellness suggestions provided.",
        "crisis_flag": False,
    }
