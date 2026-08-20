import os
from typing import Dict, Any, Optional
from google import genai
from google.genai import types
from backend.app.core.config import settings

class AiService:
    def __init__(self):
        self._api_key = os.getenv("GEMINI_API_KEY")
        self._client = None
        if self._api_key:
            try:
                # Initialize Google GenAI client (v1 SDK style)
                self._client = genai.Client(api_key=self._api_key)
            except Exception as e:
                # Fallback handled safely to avoid crash
                self._client = None

    def analyze_complaint(self, title: str, description: str) -> Dict[str, Any]:
        """Analyzes complaint descriptions via Gemini API to predict category, priority, and summary."""
        if not self._client:
            # Safe production mock fallback
            return self._fallback_local_rules(title, description)

        prompt = f"""
        You are CampusCare AI, an automated smart routing assistant for engineering and college maintenance.
        Analyze the following student complaint ticket and output a structured JSON containing:
        1. "category": Choose exactly from ["IT Support", "Plumbing", "Electrical", "Cleaning", "Furniture"]
        2. "priority": Choose exactly from ["Critical", "High", "Medium", "Low"]
        3. "summary": A 1-sentence concise description of the core problem
        4. "confidence": A float between 0.0 and 1.0 representing classification certainty

        Ticket Title: {title}
        Ticket Description: {description}

        Format the response strictly as valid JSON with the properties above. Do not output markdown wrappers.
        """
        try:
            # We use gemini-2.5-flash as the fast, lightweight model
            response = self._client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            import json
            parsed = json.loads(response.text.strip())
            return {
                "predicted_category": parsed.get("category", "IT Support"),
                "predicted_priority": parsed.get("priority", "Medium"),
                "summary": parsed.get("summary", "No summary generated."),
                "confidence_score": float(parsed.get("confidence", 0.85))
            }
        except Exception:
            return self._fallback_local_rules(title, description)

    def _fallback_local_rules(self, title: str, description: str) -> Dict[str, Any]:
        """Simple rules-engine fallback when Gemini API credential is not configured or fails."""
        combined = (title + " " + description).lower()
        
        # Determine category
        category = "Cleaning"
        if "wifi" in combined or "internet" in combined or "router" in combined or "login" in combined or "portal" in combined:
            category = "IT Support"
        elif "water" in combined or "leak" in combined or "flush" in combined or "pipe" in combined or "tap" in combined or "plumber" in combined:
            category = "Plumbing"
        elif "light" in combined or "fan" in combined or "switch" in combined or "power" in combined or "wire" in combined or "shock" in combined:
            category = "Electrical"
        elif "chair" in combined or "desk" in combined or "bench" in combined or "board" in combined or "furniture" in combined:
            category = "Furniture"

        # Determine priority
        priority = "Medium"
        if "shock" in combined or "flood" in combined or "danger" in combined or "spark" in combined or "urgent" in combined:
            priority = "Critical"
        elif "broken" in combined or "unable" in combined or "no power" in combined:
            priority = "High"
        elif "dust" in combined or "dirty" in combined or "slow" in combined:
            priority = "Low"

        summary = f"Student reports {category.lower()} issue: '{title[:60]}...'"
        
        return {
            "predicted_category": category,
            "predicted_priority": priority,
            "summary": summary,
            "confidence_score": 0.75
        }

ai_service = AiService()
