"""
ARIA Agent Mode — Autonomous Listing Draft Assistant
Purely additive file. Does not modify chatbot.py, chat.py, or any
existing listing/price/spam logic. Only calls them.
"""

import re
from ml.price_model import predict_price
from ml.spam_model import is_spam

CATEGORY_KEYWORDS = {
    "Books": ["book", "textbook", "novel", "guide"],
    "Laptop": ["laptop", "notebook pc", "macbook"],
    "Calculator": ["calculator", "casio", "fx-"],
    "Drawing Instruments": ["drafter", "compass box", "drawing kit"],
    "Stationery": ["pen", "stapler", "notebook", "file", "register"],
    "Fan": ["fan", "table fan"],
    "Cooler": ["cooler", "air cooler"],
    "Hostel Items": ["bucket", "almirah", "mattress", "trunk", "stand"],
    "Electronics": ["charger", "cable", "heater", "extension board", "adapter"],
}

def guess_category(text: str) -> str:
    text_lower = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return category
    return "Other"

def extract_price(text: str):
    match = re.search(r"₹?\s?(\d{2,6})", text)
    return float(match.group(1)) if match else None

def extract_condition(text: str) -> int:
    text_lower = text.lower()
    if "like new" in text_lower or "brand new" in text_lower:
        return 5
    if "very good" in text_lower:
        return 4
    if "good" in text_lower:
        return 3
    if "fair" in text_lower or "okay" in text_lower:
        return 2
    if "poor" in text_lower or "bad" in text_lower or "old" in text_lower:
        return 1
    return 3

def run_listing_agent(user_message: str) -> dict:
    category = guess_category(user_message)
    stated_price = extract_price(user_message)
    condition = extract_condition(user_message)

    base_price = stated_price if stated_price else 200.0

    price_result = predict_price(
        category=category,
        original_price=base_price,
        condition=condition,
        months_used=6,
        demand_score=0.5,
    )

    spam_result = is_spam(title=user_message, description="")

    draft_title = user_message.strip().capitalize()[:60]

    steps_taken = [
        f"🔍 Step 1 — Detected category: **{category}**",
        f"🤖 Step 2 — Ran ML price model → suggested ₹{price_result['predicted_price']}",
        f"🛡️ Step 3 — Ran spam detector → {'⚠️ flagged' if spam_result['is_spam'] else '✅ looks safe'}",
        f"📝 Step 4 — Draft ready for your review",
    ]

    return {
        "agent_steps": steps_taken,
        "draft": {
            "title": draft_title,
            "category": category,
            "condition": condition,
            "listing_type": "sell",
            "suggested_price": price_result["predicted_price"],
            "price_range": f"₹{price_result['lower_bound']}–₹{price_result['upper_bound']}",
        },
        "spam_check": spam_result,
        "summary": (
            f"I drafted a listing for **{draft_title}** in **{category}** "
            f"at **₹{price_result['predicted_price']}** "
            f"(fair range ₹{price_result['lower_bound']}–₹{price_result['upper_bound']}). "
            f"{'⚠️ This looks like spam, please rephrase.' if spam_result['is_spam'] else 'Looks good — confirm to post it!'}"
        ),
    }


"""
Agent 2 — Buyer Search Agent

User describes what they want in natural language. The agent:
  1. Extracts category, max price, and minimum condition from the message
  2. Queries the real listings database with those filters
  3. Ranks results by AI safety score + condition
  4. Returns top matches with reasoning

Purely additive — reuses existing Listing model and query patterns,
does not modify routers/listings.py.
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_


def extract_max_price(text: str):
    match = re.search(r"under\s*₹?\s?(\d{2,6})|below\s*₹?\s?(\d{2,6})|less than\s*₹?\s?(\d{2,6})", text.lower())
    if match:
        for group in match.groups():
            if group:
                return float(group)
    return None


def extract_min_condition(text: str) -> int:
    text_lower = text.lower()
    if "like new" in text_lower or "excellent" in text_lower:
        return 5
    if "good condition" in text_lower:
        return 3
    return 1  # default: accept any condition


def run_search_agent(user_message: str, db: Session) -> dict:
    """
    Agentic step sequence:
    Step 1 -> Understand the request (extract structured filters)
    Step 2 -> Query the real listings database with those filters
    Step 3 -> Rank results by safety score + condition
    Step 4 -> Explain the picks to the user
    """
    from models import Listing

    category = guess_category(user_message)
    max_price = extract_max_price(user_message)
    min_condition = extract_min_condition(user_message)

    query = db.query(Listing).filter(Listing.is_active == True)

    if category != "Other":
        query = query.filter(Listing.category == category)
    if max_price:
        query = query.filter(Listing.price <= max_price)
    if min_condition > 1:
        query = query.filter(Listing.condition >= min_condition)

    results = query.order_by(Listing.condition.desc(), Listing.created_at.desc()).limit(5).all()

    # Fallback: if strict filters return nothing, relax category filter
    if not results and category != "Other":
        query2 = db.query(Listing).filter(Listing.is_active == True)
        if max_price:
            query2 = query2.filter(Listing.price <= max_price)
        results = query2.order_by(Listing.created_at.desc()).limit(5).all()

    steps_taken = [
        f"🔍 Step 1 — Detected: category=**{category}**, max_price=**{f'₹{int(max_price)}' if max_price else 'any'}**, min_condition=**{min_condition}/5**",
        f"🗂️ Step 2 — Queried live listings database",
        f"📊 Step 3 — Ranked {len(results)} result(s) by condition + recency",
        f"💬 Step 4 — Summary ready",
    ]

    matches = [
        {
            "id": r.id,
            "title": r.title,
            "price": r.price,
            "category": r.category,
            "condition": r.condition,
            "listing_type": r.listing_type,
            "image_url": r.image_url,
        }
        for r in results
    ]

    if matches:
        top = matches[0]
        summary = (
            f"I found **{len(matches)}** matching listing(s). "
            f"Best match: **{top['title']}** at **₹{top['price']}** "
            f"(condition {top['condition']}/5)."
        )
    else:
        summary = "I couldn't find any listings matching that exact request — try widening your price range or browsing all categories."

    return {
        "agent_steps": steps_taken,
        "matches": matches,
        "summary": summary,
    }
