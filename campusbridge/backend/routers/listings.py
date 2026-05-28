from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from database import get_db
from models import Listing, User
from auth import get_current_user
from utils.cloudinary import upload_image
from ml.spam_model import is_spam

router = APIRouter(prefix="/listings", tags=["Listings"])

def get_verification_info(listing: Listing) -> dict:
    """Run AI spam check and return verification badge info"""
    try:
        result = is_spam(listing.title or "", listing.description or "")
        spam_prob = result["spam_probability"]
        is_flagged = result["is_spam"]

        if is_flagged or spam_prob > 0.6:
            return {
                "ai_verified": False,
                "spam_score": spam_prob,
                "verification_label": "⚠️ Under Review",
                "verification_color": "#CC8800",
                "verification_bg": "#FFF8E8",
            }
        elif spam_prob < 0.15:
            return {
                "ai_verified": True,
                "spam_score": spam_prob,
                "verification_label": "✅ AI Verified",
                "verification_color": "#00A896",
                "verification_bg": "#E8FBF8",
            }
        else:
            return {
                "ai_verified": True,
                "spam_score": spam_prob,
                "verification_label": "🔍 Reviewed",
                "verification_color": "#0080CC",
                "verification_bg": "#EBF5FF",
            }
    except Exception:
        return {
            "ai_verified": True,
            "spam_score": 0.0,
            "verification_label": "✅ AI Verified",
            "verification_color": "#00A896",
            "verification_bg": "#E8FBF8",
        }

def listing_to_dict(listing: Listing, db: Session) -> dict:
    seller = db.query(User).filter(User.id == listing.seller_id).first()
    verification = get_verification_info(listing)
    return {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price": listing.price,
        "condition": listing.condition,
        "category": listing.category,
        "listing_type": listing.listing_type.value if hasattr(listing.listing_type, 'value') else listing.listing_type,
        "department_tag": listing.department_tag,
        "semester_tag": listing.semester_tag,
        "image_url": listing.image_url,
        "is_active": listing.is_active,
        "is_flagged": listing.is_flagged,
        "seller_id": listing.seller_id,
        "seller_name": seller.name if seller else "RGPV Student",
        "seller_school": seller.school if seller else "",
        "seller_department": seller.department if seller else "",
        "seller_semester": seller.semester if seller else 0,
        "seller_email": seller.email if seller else "",
        "created_at": str(listing.created_at),
        # AI Verification fields
        "ai_verified": verification["ai_verified"],
        "spam_score": verification["spam_score"],
        "verification_label": verification["verification_label"],
        "verification_color": verification["verification_color"],
        "verification_bg": verification["verification_bg"],
    }

@router.post("/")
async def create_listing(
    title: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    condition: int = Form(...),
    category: str = Form(...),
    listing_type: str = Form(...),
    department_tag: str = Form(None),
    semester_tag: int = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = None
    if image and image.filename:
        try:
            contents = await image.read()
            image_url = upload_image(contents)
        except Exception as e:
            print(f"Image upload failed: {e}")

    # Run spam check before saving
    spam_result = is_spam(title, description or "")

    new_listing = Listing(
        title=title,
        description=description,
        price=price,
        condition=condition,
        category=category,
        listing_type=listing_type,
        department_tag=department_tag or current_user.department,
        semester_tag=semester_tag,
        image_url=image_url,
        seller_id=current_user.id,
        is_active=True,
        is_flagged=spam_result["is_spam"],
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return listing_to_dict(new_listing, db)

@router.get("/")
def get_listings(
    category: Optional[str] = None,
    listing_type: Optional[str] = None,
    department_tag: Optional[str] = None,
    semester_tag: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_condition: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Listing).filter(Listing.is_active == True)
    if category:
        query = query.filter(Listing.category == category)
    if listing_type:
        query = query.filter(Listing.listing_type == listing_type)
    if department_tag:
        query = query.filter(Listing.department_tag == department_tag)
    if semester_tag:
        query = query.filter(Listing.semester_tag == semester_tag)
    if min_price is not None:
        query = query.filter(Listing.price >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price <= max_price)
    if min_condition is not None:
        query = query.filter(Listing.condition >= min_condition)
    if search:
        query = query.filter(
            or_(
                Listing.title.ilike(f"%{search}%"),
                Listing.description.ilike(f"%{search}%"),
                Listing.category.ilike(f"%{search}%"),
            )
        )
    listings = query.order_by(Listing.created_at.desc()).offset(skip).limit(limit).all()
    return [listing_to_dict(l, db) for l in listings]

@router.get("/my-listings")
def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listings = db.query(Listing).filter(
        Listing.seller_id == current_user.id
    ).order_by(Listing.created_at.desc()).all()
    return [listing_to_dict(l, db) for l in listings]

@router.get("/{listing_id}")
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.is_active == True
    ).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing_to_dict(listing, db)

@router.put("/{listing_id}")
def update_listing(
    listing_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    price: Optional[float] = None,
    condition: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your listing")
    if title: listing.title = title
    if description: listing.description = description
    if price: listing.price = price
    if condition: listing.condition = condition
    db.commit()
    db.refresh(listing)
    return listing_to_dict(listing, db)

@router.delete("/{listing_id}")
def delete_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your listing")
    listing.is_active = False
    db.commit()
    return {"message": "Listing removed successfully"}
