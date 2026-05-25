from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Listing
from auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

ADMIN_EMAILS = ["snehachoudhary@gmail.com", "admin@campusbridge.com"]

def get_admin(current_user: User = Depends(get_current_user)):
    if current_user.email not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Admin access only")
    return current_user

@router.get("/stats")
def get_stats(admin=Depends(get_admin), db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count(),
        "total_listings": db.query(Listing).count(),
        "sell_listings": db.query(Listing).filter(Listing.listing_type == "sell").count(),
        "rent_listings": db.query(Listing).filter(Listing.listing_type == "rent").count(),
        "borrow_listings": db.query(Listing).filter(Listing.listing_type == "borrow").count(),
        "swap_listings": db.query(Listing).filter(Listing.listing_type == "swap").count(),
        "spam_flagged": db.query(Listing).filter(Listing.is_flagged == True).count(),
    }

@router.get("/users")
def get_all_users(admin=Depends(get_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "school": u.school,
        "department": u.department,
        "semester": u.semester,
        "phone": u.phone,
        "created_at": str(u.created_at),
        "listings_count": db.query(Listing).filter(Listing.seller_id == u.id).count(),
    } for u in users]

@router.get("/listings")
def get_all_listings(admin=Depends(get_admin), db: Session = Depends(get_db)):
    listings = db.query(Listing).all()
    return [{
        "id": l.id,
        "title": l.title,
        "category": l.category,
        "listing_type": l.listing_type,
        "price": l.price,
        "condition": l.condition,
        "is_flagged": l.is_flagged,
        "seller_id": l.seller_id,
        "created_at": str(l.created_at),
    } for l in listings]

@router.delete("/listings/{listing_id}")
def delete_listing(listing_id: int, admin=Depends(get_admin), db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(listing)
    db.commit()
    return {"message": "Deleted"}

@router.delete("/users/{user_id}")
def delete_user(user_id: int, admin=Depends(get_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(user)
    db.commit()
    return {"message": "Deleted"}
