from google import genai
from sqlalchemy.orm import Session
from models import Listing, ChatHistory
from aria.context import get_context
import os
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_live_listings_summary(db):
    try:
        listings = db.query(Listing).filter(Listing.is_active == True).limit(20).all()
        if not listings:
            return "No listings available."
        summary = "LIVE LISTINGS:\n"
        for l in listings:
            ltype = l.listing_type.value if hasattr(l.listing_type, "value") else l.listing_type
            summary += f"- {l.title} | {l.category} | {ltype} | Rs.{l.price}\n"
        return summary
    except Exception as e:
        return "Listings unavailable."

def save_message(user_id, role, msg_content, db):
    try:
        msg = ChatHistory(user_id=user_id, role=role, content=msg_content)
        db.add(msg)
        db.commit()
    except:
        pass

def get_fallback_response(message):
    msg = message.lower()
    if "borrow" in msg:
        return "Borrow items from RGPV students temporarily! Browse Borrow listings and contact the seller."
    if "calculator" in msg or "casio" in msg:
        return "Casio fx-991ES PLUS available to borrow for Rs.100/day! Check Calculator category."
    if "book" in msg or "notes" in msg:
        return "Books available: Engineering Maths Rs.130, CS Books Rs.800, GATE Papers Rs.400. Browse Books!"
    if "laptop" in msg:
        return "HP Laptop available to borrow for Rs.200/day. Check Laptop category!"
    if "hostel" in msg or "fan" in msg or "cooler" in msg or "bed" in msg:
        return "Hostel Items: Bed Rs.1500, Almirah Rs.2400, Fan Rs.600, Cooler rent Rs.500/month!"
    if "hi" in msg or "hello" in msg or "hey" in msg:
        return "Hello! I am ARIA your RGPV Campus AI. Ask me about listings, prices, or features!"
    if "sell" in msg or "post" in msg:
        return "Click + List Item in navbar, fill 3 steps, AI suggests price, go live instantly!"
    return "I am ARIA! Ask me: What books are available? How does borrowing work? Show hostel items?"

def chat_with_aria(message, user_id, db, user_name=None, user_department=None, user_semester=None):
    try:
        live_listings = get_live_listings_summary(db)
        context = f"Student: {user_name}, Dept: {user_department}, Sem: {user_semester}"
        full_message = f"[{context}]\n[{live_listings}]\nQuestion: {message}"
        save_message(user_id, "user", message, db)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=full_message,
            config={"system_instruction": get_context(), "max_output_tokens": 500}
        )
        aria_response = response.text
        save_message(user_id, "model", aria_response, db)
        return aria_response
    except Exception as e:
        print(f"ARIA Error: {e}")
        return get_fallback_response(message)
