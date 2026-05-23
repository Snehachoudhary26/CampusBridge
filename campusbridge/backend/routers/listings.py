from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from database import get_db
from models import Listing, User
from schemas import ListingCreate, ListingResponse
from auth import get_current_user
from utils.cloudinary import upload_image

router = APIRouter(prefix="/listings", tags=["Listings"])

@router.post("/", response_model=ListingResponse)
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
        contents = await image.read()
        image_url = upload_image(contents)

    new_listing = Listing(
        title=title,
        description=description,
        price=price,
        condition=condition,
        category=category,
        listing_type=listing_type,
        department_tag=department_tag,
        semester_tag=semester_tag,
        image_url=image_url,
        seller_id=current_user.id
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing

@router.get("/", response_model=List[ListingResponse])
def get_listings(
    category: Optional[str] = None,
    listing_type: Optional[str] = None,
    department_tag: Optional[str] = None,
    semester_tag: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    condition: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Listing).filter(
        Listing.is_active == True,
        Listing.is_flagged == False
    )

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
    if condition:
        query = query.filter(Listing.condition >= condition)
    if search:
        query = query.filter(
            or_(
                Listing.title.ilike(f"%{search}%"),
                Listing.description.ilike(f"%{search}%")
            )
        )

    listings = query.order_by(Listing.created_at.desc()).offset(skip).limit(limit).all()
    return listings

@router.get("/my-listings", response_model=List[ListingResponse])
def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listings = db.query(Listing).filter(
        Listing.seller_id == current_user.id
    ).order_by(Listing.created_at.desc()).all()
    return listings

@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(
        Listing.id == listing_id,
        Listing.is_active == True
    ).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return listing

@router.put("/{listing_id}", response_model=ListingResponse)
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
    if title:
        listing.title = title
    if description:
        listing.description = description
    if price:
        listing.price = price
    if condition:
        listing.condition = condition
    db.commit()
    db.refresh(listing)
    return listing

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