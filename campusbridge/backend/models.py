from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class ListingType(str, enum.Enum):
    sell = "sell"
    rent = "rent"
    borrow = "borrow"
    swap = "swap"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    department = Column(String, nullable=False)
    school = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    listings = relationship("Listing", back_populates="seller")
    sent_messages = relationship("Message", back_populates="sender")

class Listing(Base):
    __tablename__ = "listings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    condition = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    listing_type = Column(Enum(ListingType), default=ListingType.sell)
    department_tag = Column(String, nullable=True)
    semester_tag = Column(Integer, nullable=True)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_flagged = Column(Boolean, default=False)
    seller_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    seller = relationship("User", back_populates="listings")
    messages = relationship("Message", back_populates="listing")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"))
    listing_id = Column(Integer, ForeignKey("listings.id"))
    receiver_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    sender = relationship("User", back_populates="sent_messages")
    listing = relationship("Listing", back_populates="messages")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)# Note: Run this SQL in your DB to add the column:
# ALTER TABLE users ADD COLUMN IF NOT EXISTS availability VARCHAR DEFAULT 'Available after 7 PM';
# ALTER TABLE users ADD COLUMN IF NOT EXISTS auto_reply VARCHAR DEFAULT 'Thanks for your interest! I will get back to you after 7 PM today. 🙏';
# ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp VARCHAR;
