from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserRegister, UserLogin, UserResponse, Token
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password),
        phone=user_data.phone,
        department=user_data.department,
        school=user_data.school,
        semester=user_data.semester,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "department": new_user.department,
            "school": new_user.school,
            "semester": new_user.semester,
            "created_at": str(new_user.created_at),
        }
    }

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "department": user.department,
            "school": user.school,
            "semester": user.semester,
            "created_at": str(user.created_at),
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "department": current_user.department,
        "school": current_user.school,
        "semester": current_user.semester,
        "created_at": str(current_user.created_at),
    }

@router.put("/me")
def update_profile(
    name: str = None,
    phone: str = None,
    semester: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if name: current_user.name = name
    if phone: current_user.phone = phone
    if semester: current_user.semester = semester
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated"}
