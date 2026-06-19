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
