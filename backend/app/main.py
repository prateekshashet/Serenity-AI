"""
Serenity AI — FastAPI Backend
Main application entry point with CORS, routers, and health check.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv(override=True)

import os
api_key = os.environ.get("GEMINI_API_KEY", "")
masked_key = f"{api_key[:4]}...{api_key[-4:]}" if len(api_key) > 8 else "NOT_SET_OR_TOO_SHORT"
print(f"STARTUP CHECK: Loaded GEMINI_API_KEY: {masked_key}")

from app.routers import analyze

app = FastAPI(
    title="Serenity AI API",
    description="AI-powered Emotional Wellness Assessment System",
    version="1.0.0",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analyze.router)


@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "Serenity AI API"}
