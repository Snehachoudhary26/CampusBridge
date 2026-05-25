"""
Run this once to populate the database with realistic sample listings.
Usage: python seed_listings.py
"""
from database import SessionLocal, engine, Base
from models import User, Listing, ListingType
from auth import hash_password
from datetime import datetime

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Create demo users ──────────────────────────────────────────────
demo_users = [
    {"name": "Arjun Sharma",    "email": "arjun@rgpv.ac.in",   "department": "B.Tech CSE (AI & ML)",              "school": "School of Information Technology",         "semester": 5},
    {"name": "Priya Verma",     "email": "priya@rgpv.ac.in",   "department": "B.Tech Computer Science",           "school": "University Institute of Technology",       "semester": 3},
    {"name": "Rahul Patel",     "email": "rahul@rgpv.ac.in",   "department": "B.Tech Mechanical",                 "school": "University Institute of Technology",       "semester": 7},
    {"name": "Kavya Singh",     "email": "kavya@rgpv.ac.in",   "department": "B.Tech CSE (Data Science)",         "school": "School of Information Technology",         "semester": 4},
    {"name": "Mohit Gupta",     "email": "mohit@rgpv.ac.in",   "department": "B.Tech Electronics and Communication","school": "University Institute of Technology",      "semester": 6},
    {"name": "Ananya Joshi",    "email": "ananya@rgpv.ac.in",  "department": "MBA",                               "school": "School of Applied Management",             "semester": 2},
    {"name": "Vikram Yadav",    "email": "vikram@rgpv.ac.in",  "department": "B.Tech Civil",                      "school": "University Institute of Technology",       "semester": 5},
    {"name": "Sneha Mishra",    "email": "sneha2@rgpv.ac.in",  "department": "B.Tech Information Technology",     "school": "University Institute of Technology",       "semester": 3},
]

created_users = []
for u in demo_users:
    existing = db.query(User).filter(User.email == u["email"]).first()
    if not existing:
        user = User(
            name=u["name"], email=u["email"],
            password=hash_password("demo1234"),
            department=u["department"], school=u["school"],
            semester=u["semester"], phone=f"+91 98{len(u['name'])*11111:08d}"[:13],
        )
        db.add(user)
        db.flush()
        created_users.append(user)
    else:
        created_users.append(existing)

db.commit()
print(f"✅ {len(created_users)} users ready")

# ── Create realistic listings ──────────────────────────────────────
listings_data = [
    # BOOKS
    {
        "title": "RD Sharma Mathematics Vol 1 & 2",
        "description": "Complete set of RD Sharma for engineering maths. Covered Semester 1 & 2 topics. Some pencil marks but fully readable. Very useful for RGPV exams.",
        "price": 280, "condition": 4, "category": "Books",
        "listing_type": "sell", "department_tag": "B.Tech CSE (AI & ML)",
        "semester_tag": 1, "seller_idx": 0,
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    },
    {
        "title": "Engineering Physics by H.K. Dass",
        "description": "Semester 1 Physics textbook. Excellent condition, barely used. All chapters marked and highlighted. Selling because I cleared the semester.",
        "price": 150, "condition": 5, "category": "Books",
        "listing_type": "sell", "department_tag": "B.Tech Computer Science",
        "semester_tag": 1, "seller_idx": 1,
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
        "title": "Data Structures & Algorithms — Cormen (CLRS)",
        "description": "The bible of algorithms! CLRS 3rd edition. Perfect for placements and competitive programming. Condition is 4/5, some highlighting in first 3 chapters.",
        "price": 450, "condition": 4, "category": "Books",
        "listing_type": "sell", "department_tag": "B.Tech CSE (AI & ML)",
        "semester_tag": 3, "seller_idx": 3,
        "image_url": "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    },
    {
        "title": "Borrow — Operating Systems by Galvin",
        "description": "Need it for your exam? Borrow for 7 days, return in same condition. Perfect for Sem 5 OS preparation. Available after 6 PM weekdays.",
        "price": 20, "condition": 4, "category": "Books",
        "listing_type": "borrow", "department_tag": "B.Tech Computer Science",
        "semester_tag": 5, "seller_idx": 1,
        "image_url": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
    },
    {
        "title": "Complete MBA Study Material — Sem 1 & 2",
        "description": "Full set of printed notes + textbooks for MBA Sem 1 and 2. Marketing, Finance, HR all covered. Saved me during exams!",
        "price": 600, "condition": 3, "category": "Books",
        "listing_type": "sell", "department_tag": "MBA",
        "semester_tag": 2, "seller_idx": 5,
        "image_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    },

    # LAPTOPS
    {
        "title": "Dell Inspiron 15 — i5 11th Gen, 8GB RAM",
        "description": "Used for 2 years. Works perfectly for coding, ML projects, and college work. Battery backup 4-5 hours. Charger included. No scratches on screen. Selling because upgrading.",
        "price": 28000, "condition": 4, "category": "Laptop",
        "listing_type": "sell", "department_tag": "B.Tech CSE (AI & ML)",
        "semester_tag": 5, "seller_idx": 0,
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    },
    {
        "title": "Rent — HP Pavilion for Project Submission",
        "description": "Rent my HP Pavilion laptop for ₹100/day. Perfect for project demos, presentations, or when your laptop is being repaired. SSD, fast boot.",
        "price": 100, "condition": 5, "category": "Laptop",
        "listing_type": "rent", "department_tag": "B.Tech Computer Science",
        "semester_tag": 4, "seller_idx": 1,
        "image_url": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
    },

    # CALCULATORS
    {
        "title": "Casio fx-991ES PLUS Scientific Calculator",
        "description": "Works perfectly. All buttons responsive. Used for 1 year. Comes with cover. Essential for engineering students. Selling as I graduated.",
        "price": 650, "condition": 4, "category": "Calculator",
        "listing_type": "sell", "department_tag": "B.Tech Mechanical",
        "semester_tag": 3, "seller_idx": 2,
        "image_url": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400",
    },
    {
        "title": "Borrow — Casio Scientific Calculator for Exam",
        "description": "Exam tomorrow and forgot your calculator? Borrow mine! Available in CV Raman Hostel Block B. Return same day.",
        "price": 0, "condition": 5, "category": "Calculator",
        "listing_type": "borrow", "department_tag": "B.Tech Electronics and Communication",
        "semester_tag": 2, "seller_idx": 4,
        "image_url": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
    },

    # DRAWING INSTRUMENTS
    {
        "title": "Complete Drawing Instrument Set — Staedtler",
        "description": "Full Staedtler set with drafter, compass, set squares, mini drafter. Used for 1 semester. All pieces intact. Perfect for architecture and civil students.",
        "price": 800, "condition": 4, "category": "Drawing Instruments",
        "listing_type": "sell", "department_tag": "B.Tech Civil",
        "semester_tag": 2, "seller_idx": 6,
        "image_url": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
    },
    {
        "title": "Mini Drafter — Rent for Engineering Drawing",
        "description": "Rent my mini drafter for ₹50/day or ₹200/week. Perfect for Engineering Drawing subject in Sem 1/2. Available in hostel.",
        "price": 50, "condition": 4, "category": "Drawing Instruments",
        "listing_type": "rent", "department_tag": "B.Tech Mechanical",
        "semester_tag": 1, "seller_idx": 2,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    },

    # ELECTRONICS
    {
        "title": "boAt Rockerz 450 Bluetooth Headphones",
        "description": "40 hours battery life, works perfectly. Selling because I bought AirPods. No damage, comes with original box and cable.",
        "price": 1200, "condition": 4, "category": "Electronics",
        "listing_type": "sell", "department_tag": "B.Tech CSE (Data Science)",
        "semester_tag": 4, "seller_idx": 3,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    },
    {
        "title": "65W Fast Charger + USB-C Cable",
        "description": "Compatible with OnePlus, Samsung, Xiaomi. Works perfectly, selling because I got wireless charger. Original purchase from Amazon.",
        "price": 350, "condition": 5, "category": "Electronics",
        "listing_type": "sell", "department_tag": "B.Tech Information Technology",
        "semester_tag": 3, "seller_idx": 7,
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400",
    },

    # HOSTEL ITEMS
    {
        "title": "Single Bed Mattress — Hostel Size",
        "description": "3-inch foam mattress, hostel standard size (72x30 inches). Used for 1 year, clean and comfortable. Selling as I'm going home for vacation.",
        "price": 900, "condition": 3, "category": "Hostel Items",
        "listing_type": "sell", "department_tag": "B.Tech Mechanical",
        "semester_tag": 5, "seller_idx": 2,
        "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    },
    {
        "title": "Swap — Induction Cooktop for Study Table Lamp",
        "description": "My induction cooktop (Prestige) is in perfect condition. Looking to swap for a good study lamp. DM if interested in swap!",
        "price": 800, "condition": 4, "category": "Hostel Items",
        "listing_type": "swap", "department_tag": "MBA",
        "semester_tag": 2, "seller_idx": 5,
        "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
    },

    # FAN / COOLER
    {
        "title": "Usha Table Fan — 3 Speed",
        "description": "Works perfectly, 3 speed settings. Used for 2 summers. Selling as hostel provided fans now. Great for room or study desk.",
        "price": 700, "condition": 3, "category": "Fan",
        "listing_type": "sell", "department_tag": "B.Tech Computer Science",
        "semester_tag": 3, "seller_idx": 1,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    },
    {
        "title": "Rent — Air Cooler for Summer (Per Month)",
        "description": "Beat the Bhopal summer heat! Renting my Symphony cooler for ₹500/month. Works great, 20L tank. Available from May-July.",
        "price": 500, "condition": 4, "category": "Cooler",
        "listing_type": "rent", "department_tag": "B.Tech Electronics and Communication",
        "semester_tag": 6, "seller_idx": 4,
        "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
    },

    # STATIONERY
    {
        "title": "Stapler + Hole Punch + Binding Clips Set",
        "description": "Complete stationery kit for project submissions. Stapler with refills, hole punch, and 50 binding clips. Selling at low price.",
        "price": 120, "condition": 4, "category": "Stationery",
        "listing_type": "sell", "department_tag": "B.Tech CSE (AI & ML)",
        "semester_tag": 4, "seller_idx": 0,
        "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400",
    },
]

count = 0
for l in listings_data:
    seller = created_users[l["seller_idx"]]
    listing = Listing(
        title=l["title"],
        description=l["description"],
        price=l["price"],
        condition=l["condition"],
        category=l["category"],
        listing_type=l["listing_type"],
        department_tag=l.get("department_tag"),
        semester_tag=l.get("semester_tag"),
        image_url=l.get("image_url"),
        seller_id=seller.id,
        is_active=True,
        is_flagged=False,
    )
    db.add(listing)
    count += 1

db.commit()
db.close()
print(f"✅ {count} listings created successfully!")
print("🎓 CampusBridge is now populated with real looking data!")
print("👥 Demo users created with password: demo1234")
