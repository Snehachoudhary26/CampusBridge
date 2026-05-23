from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import ChatMessage
from auth import get_current_user
from aria.chatbot import chat_with_aria

router = APIRouter(prefix="/chat", tags=["ARIA Chatbot"])

@router.post("/")
def chat(
    message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    response = chat_with_aria(
        message=message.message,
        user_id=current_user.id,
        db=db,
        user_name=current_user.name,
        user_department=current_user.department,
        user_semester=current_user.semester
    )
    return {
        "response": response,
        "user": current_user.name,
        "department": current_user.department,
        "semester": current_user.semester
    }

@router.post("/guest")
def chat_guest(message: ChatMessage, db: Session = Depends(get_db)):
    response = chat_with_aria(
        message=message.message,
        user_id=0,
        db=db
    )
    return {"response": response}

@router.delete("/history")
def clear_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from models import ChatHistory
    db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id
    ).delete()
    db.commit()
    return {"message": "Chat history cleared"}