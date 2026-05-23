import numpy as np
from sqlalchemy.orm import Session
from models import Listing, User
from typing import List

def get_recommendations(user_id: int, db: Session, limit: int = 6) -> List[dict]:
    current_user = db.query(User).filter(User.id == user_id).first()
    if not current_user:
        return get_popular_listings(db, limit)

    same_dept_listings = db.query(Listing).filter(
        Listing.is_active == True,
        Listing.is_flagged == False,
        Listing.seller_id != user_id,
        Listing.department_tag == current_user.department
    ).order_by(Listing.created_at.desc()).limit(limit * 2).all()

    same_sem_listings = db.query(Listing).filter(
        Listing.is_active == True,
        Listing.is_flagged == False,
        Listing.seller_id != user_id,
        Listing.semester_tag == current_user.semester
    ).order_by(Listing.created_at.desc()).limit(limit * 2).all()

    all_listings = db.query(Listing).filter(
        Listing.is_active == True,
        Listing.is_flagged == False,
        Listing.seller_id != user_id
    ).order_by(Listing.created_at.desc()).limit(limit * 2).all()

    scored = {}

    for listing in same_dept_listings:
        scored[listing.id] = scored.get(listing.id, 0) + 3
    for listing in same_sem_listings:
        scored[listing.id] = scored.get(listing.id, 0) + 2
    for listing in all_listings:
        scored[listing.id] = scored.get(listing.id, 0) + 1

    sorted_ids = sorted(scored.keys(), key=lambda x: scored[x], reverse=True)[:limit]

    result = []
    for lid in sorted_ids:
        listing = db.query(Listing).filter(Listing.id == lid).first()
        if listing:
            result.append({
                "id": listing.id,
                "title": listing.title,
                "price": listing.price,
                "condition": listing.condition,
                "category": listing.category,
                "listing_type": listing.listing_type,
                "department_tag": listing.department_tag,
                "semester_tag": listing.semester_tag,
                "image_url": listing.image_url,
                "relevance_score": scored[lid]
            })

    if len(result) < limit:
        popular = get_popular_listings(db, limit - len(result))
        existing_ids = [r["id"] for r in result]
        for p in popular:
            if p["id"] not in existing_ids:
                result.append(p)

    return result[:limit]

def get_popular_listings(db: Session, limit: int = 6) -> List[dict]:
    listings = db.query(Listing).filter(
        Listing.is_active == True,
        Listing.is_flagged == False
    ).order_by(Listing.created_at.desc()).limit(limit).all()

    return [{
        "id": l.id,
        "title": l.title,
        "price": l.price,
        "condition": l.condition,
        "category": l.category,
        "listing_type": l.listing_type,
        "department_tag": l.department_tag,
        "semester_tag": l.semester_tag,
        "image_url": l.image_url,
        "relevance_score": 1
    } for l in listings]