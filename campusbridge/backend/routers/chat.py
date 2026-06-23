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
from aria.agent import run_listing_agent
from pydantic import BaseModel

class AgentRequest(BaseModel):
    message: str

@router.post("/agent")
def chat_agent(request: AgentRequest):
    """
    Agent Mode — autonomously chains price prediction + spam detection
    to draft a ready-to-post listing from a single natural language message.
    """
    result = run_listing_agent(request.message)
    return result


from aria.agent import run_search_agent
from database import get_db
from sqlalchemy.orm import Session as _Session

@router.post("/agent/search")
def chat_agent_search(request: AgentRequest, db: _Session = Depends(get_db)):
    """
    Agent Mode (Search) — autonomously queries the live listings database
    based on a natural language buyer request, ranks results, and explains picks.
    """
    result = run_search_agent(request.message, db)
    return result


from aria.agent import run_search_agent
from database import get_db
from sqlalchemy.orm import Session as _Session

@router.post("/agent/search")
def chat_agent_search(request: AgentRequest, db: _Session = Depends(get_db)):
    """
    Agent Mode (Search) — autonomously queries the live listings database
    based on a natural language buyer request, ranks results, and explains picks.
    """
    result = run_search_agent(request.message, db)
    return result
