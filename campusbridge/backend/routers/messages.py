from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from database import get_db
from models import Message, User, Listing
from schemas import MessageCreate, MessageResponse
from auth import get_current_user

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.post("/", response_model=MessageResponse)
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == message_data.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot message yourself")

    new_message = Message(
        content=message_data.content,
        sender_id=current_user.id,
        listing_id=message_data.listing_id,
        receiver_id=message_data.receiver_id
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.get("/conversations")
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    ).all()

    conversations = {}
    for msg in messages:
        other_user_id = msg.receiver_id if msg.sender_id == current_user.id else msg.sender_id
        key = f"{min(current_user.id, other_user_id)}_{max(current_user.id, other_user_id)}_{msg.listing_id}"

        if key not in conversations:
            other_user = db.query(User).filter(User.id == other_user_id).first()
            listing = db.query(Listing).filter(Listing.id == msg.listing_id).first()
            conversations[key] = {
                "conversation_id": key,
                "other_user_id": other_user_id,
                "other_user_name": other_user.name if other_user else "Unknown",
                "listing_id": msg.listing_id,
                "listing_title": listing.title if listing else "Unknown",
                "last_message": msg.content,
                "last_message_time": msg.created_at
            }
        else:
            if msg.created_at > conversations[key]["last_message_time"]:
                conversations[key]["last_message"] = msg.content
                conversations[key]["last_message_time"] = msg.created_at

    return {"conversations": list(conversations.values())}

@router.get("/{listing_id}/{other_user_id}", response_model=List[MessageResponse])
def get_messages(
    listing_id: int,
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(Message).filter(
        Message.listing_id == listing_id,
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at.asc()).all()
    return messages