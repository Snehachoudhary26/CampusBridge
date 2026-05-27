from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from models import Listing, ChatHistory
from aria.context import get_context
import os
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_live_listings_summary(db: Session) -> str:
    listings = db.query(Listing).filter(
        Listing.is_active == True,
        Listing.is_flagged == False
    ).order_by(Listing.created_at.desc()).limit(20).all()
    if not listings:
        return "No listings currently available on CampusBridge."
    summary = "CURRENT LIVE LISTINGS ON CAMPUSBRIDGE:\n"
    for listing in listings:
        summary += f"- {listing.title} | Category: {listing.category} | Type: {listing.listing_type} | Price: ₹{listing.price} | Condition: {listing.condition}/5"
        if listing.department_tag:
            summary += f" | For: {listing.department_tag}"
        if listing.semester_tag:
            summary += f" Sem {listing.semester_tag}"
        summary += "\n"
    return summary

def get_chat_history(user_id: int, db: Session) -> list:
    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).order_by(ChatHistory.created_at.asc()).limit(10).all()
    return [{"role": msg.role, "parts": [msg.content]} for msg in history]

def save_message(user_id: int, role: str, content: str, db: Session):
    msg = ChatHistory(user_id=user_id, role=role, content=content)
    db.add(msg)
    db.commit()

def chat_with_aria(message: str, user_id: int, db: Session, user_name: str = None, user_department: str = None, user_semester: int = None) -> str:
    try:
        live_listings = get_live_listings_summary(db)
        user_context = ""
        if user_name:
            user_context += f"Student name: {user_name}\n"
        if user_department:
            user_context += f"Department: {user_department}\n"
        if user_semester:
            user_context += f"Current semester: {user_semester}\n"

        full_message = ""
        if user_context:
            full_message += f"[Student Info: {user_context}]\n"
        full_message += f"[{live_listings}]\n"
        full_message += f"Student question: {message}"

        save_message(user_id, "user", message, db)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=full_message,
            config=types.GenerateContentConfig(
                system_instruction=get_context()
            )
        )
        aria_response = response.text
        save_message(user_id, "model", aria_response, db)
        return aria_response

    except Exception as e:
        print(f"ARIA error: {e}")
        return "Hi! I'm ARIA 🤖, your RGPV campus assistant. I'm having a small issue right now. Please try again shortly!"
