from google import genai
from sqlalchemy.orm import Session
from models import Listing, ChatHistory
from aria.context import get_context
import os
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_live_listings_summary(db: Session) -> str:
    try:
        listings = db.query(Listing).filter(
            Listing.is_active == True,
            Listing.is_flagged == False
        ).order_by(Listing.created_at.desc()).limit(20).all()
        if not listings:
            return "No listings currently available."
        summary = "LIVE LISTINGS ON CAMPUSBRIDGE:\n"
        for l in listings:
            summary += f"- {l.title} | {l.category} | {l.listing_type} | ₹{l.price} | Condition:{l.condition}/5\n"
        return summary
    except:
        return "Listings unavailable right now."

def save_message(user_id: int, role: str, content: str, db: Session):
    try:
        msg = ChatHistory(user_id=user_id, role=role, content=content)
        db.add(msg)
        db.commit()
    except:
        pass

def get_fallback_response(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ['borrow', 'borrowing']):
        return "🤝 **Borrow Feature** — Borrow items from RGPV students temporarily! Browse listings with 'Borrow' tag, contact seller, agree on duration and return in same condition. Perfect for exam season!"
    if any(w in msg for w in ['calculator', 'casio']):
        return "🔢 **Calculators Available!** Casio fx-991ES PLUS available to borrow for ₹100/day. Browse → Calculator category!"
    if any(w in msg for w in ['book', 'books', 'notes']):
        return "📚 **Books Available!** Engineering Mathematics ₹130, CS Books Set ₹800, GATE Papers ₹400 and more! Browse → Books category."
    if any(w in msg for w in ['laptop']):
        return "💻 **Laptop Available!** HP Laptop to borrow for ₹200/day. Browse → Laptop category!"
    if any(w in msg for w in ['hostel', 'fan', 'cooler', 'bed', 'almirah']):
        return "🏠 **Hostel Items!** Bed ₹1500, Almirah ₹2400, Fan ₹600, Cooler rent ₹500/month, Kettle ₹700. Browse → Hostel Items!"
    if any(w in msg for w in ['hi', 'hello', 'hey']):
        return "👋 Hi! I'm **ARIA** — your RGPV Campus AI!\n\nI can help you:\n🔍 Find listings\n💰 Know fair prices\n📚 Find books by semester\n🤝 Understand features\n\nWhat do you need?"
    if any(w in msg for w in ['sell', 'post', 'list']):
        return "📦 **Post a Listing!** Click '+ List Item' → Fill 3 steps → AI suggests price → Go live instantly with AI verification badge!"
    if any(w in msg for w in ['price', 'cost']):
        return "💰 **Price Guide:** Books ₹100-500, Calculator ₹500-700, Laptop borrow ₹200/day, Hostel items ₹100-4000. All negotiable!"
    return "🤖 **ARIA here!** Ask me:\n• 'What books are available?'\n• 'How does borrowing work?'\n• 'Show hostel items'\n• 'How to sell my item?'"

def chat_with_aria(message: str, user_id: int, db: Session,
                   user_name: str = None, user_department: str = None,
                   user_semester: int = None) -> str:
    try:
        live_listings = get_live_listings_summary(db)
        user_context = ""
        if user_name: user_context += f"Student: {user_name}\n"
        if user_department: user_context += f"Department: {user_department}\n"
        if user_semester: user_context += f"Semester: {user_semester}\n"

        full_message = ""
        if user_context: full_message += f"[{user_context}]\n"
        full_message += f"[{live_listings}]\n"
        full_message += f"Question: {message}"

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
        print(f"ARIA Gemini Error: {e}")
        return get_fallback_response(message)
