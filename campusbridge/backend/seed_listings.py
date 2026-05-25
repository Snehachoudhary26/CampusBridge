"""
Seed script - 51 real campus listings
Run: python seed_listings.py
"""
from database import SessionLocal, engine, Base
from models import User, Listing, ListingType
from auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Clear existing listings ──────────────────────────────────────
db.query(Listing).delete()
db.commit()
print("🗑️  Cleared old listings")

# ── Demo Users ───────────────────────────────────────────────────
demo_users = [
    {"name": "Arjun Sharma",   "email": "arjun@rgpv.ac.in",   "department": "B.Tech CSE (AI & ML)",               "school": "School of Information Technology",         "semester": 5},
    {"name": "Priya Verma",    "email": "priya@rgpv.ac.in",   "department": "B.Tech Computer Science",            "school": "University Institute of Technology",       "semester": 3},
    {"name": "Rahul Patel",    "email": "rahul@rgpv.ac.in",   "department": "B.Tech Mechanical",                  "school": "University Institute of Technology",       "semester": 7},
    {"name": "Kavya Singh",    "email": "kavya@rgpv.ac.in",   "department": "B.Tech CSE (Data Science)",          "school": "School of Information Technology",         "semester": 4},
    {"name": "Mohit Gupta",    "email": "mohit@rgpv.ac.in",   "department": "B.Tech Electronics and Communication","school": "University Institute of Technology",       "semester": 6},
    {"name": "Ananya Joshi",   "email": "ananya@rgpv.ac.in",  "department": "MBA",                                "school": "School of Applied Management",             "semester": 2},
    {"name": "Vikram Yadav",   "email": "vikram@rgpv.ac.in",  "department": "B.Tech Civil",                       "school": "University Institute of Technology",       "semester": 5},
    {"name": "Sneha Mishra",   "email": "sneha2@rgpv.ac.in",  "department": "B.Tech Information Technology",      "school": "University Institute of Technology",       "semester": 3},
]

created_users = []
for u in demo_users:
    existing = db.query(User).filter(User.email == u["email"]).first()
    if not existing:
        user = User(
            name=u["name"], email=u["email"],
            password=hash_password("demo1234"),
            department=u["department"],
            school=u["school"],
            semester=u["semester"],
        )
        db.add(user)
        db.flush()
        created_users.append(user)
    else:
        created_users.append(existing)

db.commit()
print(f"✅ {len(created_users)} demo users ready")

# ── 51 Real Listings ─────────────────────────────────────────────
listings_data = [

    # ── HOSTEL ITEMS ────────────────────────────────────────────
    {
        "title": "Bed with Mattress — Single Hostel Size",
        "description": "Strong iron bed frame with 4-inch foam mattress. Hostel standard size 72x30 inches. Used for 1 year, clean and sturdy. Perfect for new hostel students. Self pickup from Boys Hostel Block C.",
        "price": 3500, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
    },
    {
        "title": "Warm Woolen Blanket — Navy Blue",
        "description": "Thick woolen blanket, perfect for Bhopal winters. Navy blue color, no damage or stains. Washed and clean. Selling because going home permanently.",
        "price": 400, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 1, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1600369671696-1e963fc71ad0?w=500&q=80",
    },
    {
        "title": "Pillow — Soft Cotton, Hostel Size",
        "description": "Standard size cotton pillow, slightly used. Soft and comfortable. Cover included. Selling as I am shifting rooms and bought a new set.",
        "price": 200, "condition": 3, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 7, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80",
    },
    {
        "title": "Wooden Study Table with Drawer",
        "description": "Solid wood study table with 2 drawers. Enough space for laptop + books. Good for hostel room. Minor scratch on side, not visible when placed against wall. Selling as I am graduating.",
        "price": 2500, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 0, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80",
    },
    {
        "title": "Adjustable Office Chair — Mesh Back",
        "description": "Comfortable mesh back chair with height adjustment. Perfect for long study sessions. Used for 1.5 years, all functions working. Selling because I prefer sitting on bed now.",
        "price": 1800, "condition": 3, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 6, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80",
    },
    {
        "title": "Steel Almirah / Locker — 2 Door",
        "description": "Heavy duty steel almirah with lock and key. 2 doors, multiple shelves. Secure for keeping valuables. Used for 2 years. Minor rust on bottom, structurally sound.",
        "price": 4000, "condition": 3, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=500&q=80",
    },
    {
        "title": "Bucket & Mug Set — Bathroom Essentials",
        "description": "Plastic bucket (20L) with mug. Both in good condition. Essential for hostel bathroom. Selling as I bought a new matching set. Color: pink bucket, blue mug.",
        "price": 150, "condition": 3, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 1, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&q=80",
    },
    {
        "title": "Laundry Basket — Large Blue",
        "description": "Large plastic laundry basket with handles. Fits 2-3 days of clothes easily. Selling as I bought a bag instead. Clean and good condition.",
        "price": 250, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 7, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&q=80",
    },
    {
        "title": "LED Table Lamp — Eye Care, USB Powered",
        "description": "USB powered LED study lamp with brightness adjustment. Eye care mode, no flicker. Perfect for night studies. Battery not required. Selling as I bought a bigger lamp.",
        "price": 500, "condition": 5, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 3, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    },
    {
        "title": "Tiffin Box — 3 Container Steel Set",
        "description": "Stainless steel 3-tier tiffin box with locking clips. Leak proof. Perfect for carrying food from mess or canteen. Selling as I am going home.",
        "price": 300, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 5, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1585704032915-c3400305e979?w=500&q=80",
    },
    {
        "title": "Electric Kettle — 1.5L Stainless Steel",
        "description": "1.5 litre electric kettle, boils in 3 minutes. Perfect for making Maggi, tea, coffee in hostel room. Used for 8 months. Auto shut-off works perfectly.",
        "price": 700, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 4, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80",
    },
    {
        "title": "Prestige Induction Stove — 1600W",
        "description": "Prestige induction cooktop 1600W. 7 preset cooking modes. Works perfectly. Selling as mess food improved. Comes with original box.",
        "price": 1500, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 5, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80",
    },
    {
        "title": "Haier Mini Fridge — 52L (Rent per Month)",
        "description": "Rent my Haier 52L mini fridge for ₹800/month. Perfect for hostel room. Keeps medicines, drinks, fruits cold. Available from June. Minimum 1 month rental.",
        "price": 800, "condition": 4, "category": "Hostel Items",
        "listing_type": "rent", "seller_idx": 0, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80",
    },
    {
        "title": "Microwave Oven — 20L Solo",
        "description": "20 litre solo microwave. Heats food in 2 minutes. Used for 1 year in PG accommodation. All buttons working. Selling as shifting to home.",
        "price": 4500, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 6, "semester_tag": 5,
        "image_url": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&q=80",
    },
    {
        "title": "Sandwich Maker — 2 Slice Non-Stick",
        "description": "Non-stick sandwich maker, makes 2 sandwiches at once. Perfect for hostel breakfast. Heats in 3 minutes. Clean and working perfectly.",
        "price": 600, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 3, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=500&q=80",
    },
    {
        "title": "Clothes Drying Stand — Foldable",
        "description": "Steel foldable clothes drying stand. Holds 10-12 clothes at once. Easy to fold and store under bed. Used for 6 months. Selling as moving to PG with dryer.",
        "price": 400, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 7, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Mosquito Repellent Machine + Refills",
        "description": "Electric mosquito repellent with 3 refill bottles. Bhopal mosquitoes are no joke! Works all night. Selling as I am going home for vacation.",
        "price": 150, "condition": 5, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 1, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&q=80",
    },
    {
        "title": "Black Umbrella — Large Size",
        "description": "Large black umbrella, windproof. Perfect for Bhopal rains. Auto open mechanism. Selling as I bought a compact travel umbrella.",
        "price": 250, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1558618047-f4739ada6af0?w=500&q=80",
    },
    {
        "title": "Steel Utensils Set — Plate, Bowl, Glass, Spoon",
        "description": "Complete stainless steel utensil set. Plate, 2 bowls, 2 glasses, spoon, fork. Hostel mess essential. Selling as I am going to home permanently.",
        "price": 500, "condition": 3, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 5, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&q=80",
    },
    {
        "title": "Pedal Dustbin — 5L",
        "description": "Small pedal dustbin for hostel room. Keeps room clean. 5 litre capacity. Hygienic and no touch operation. Selling as leaving hostel.",
        "price": 150, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 7, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Slippers — Comfortable Flip Flops",
        "description": "Comfortable rubber flip flops, bathroom slippers. Size 8. Barely used. Selling as size got small. Good for bathroom and hostel use.",
        "price": 120, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 4, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80",
    },
    {
        "title": "First Aid Kit — Complete Medical Box",
        "description": "Complete first aid kit with bandages, antiseptic, cotton, scissors, thermometer, and medicines for common problems. Essential for hostel. All items within expiry.",
        "price": 350, "condition": 5, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 0, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80",
    },
    {
        "title": "Home Repair Toolkit — Hammer, Screwdriver Set",
        "description": "Basic toolkit with hammer, screwdriver set (4 sizes), pliers, and wrench. Useful for fixing hostel furniture. Selling as I don't need it anymore.",
        "price": 400, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 6, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&q=80",
    },
    {
        "title": "Matka — Clay Water Pot with Stand",
        "description": "Traditional clay matka with iron stand and steel glass. Keeps water naturally cool — no electricity needed! Perfect for summer. Bhopal summers are brutal, stay cool naturally.",
        "price": 300, "condition": 5, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500&q=80",
    },
    {
        "title": "Clothes Clips — 50 Piece Set",
        "description": "Pack of 50 colorful plastic clothes clips. Essential for hostel drying. Never lose your clothes from balcony railing again! Selling leftover stock.",
        "price": 50, "condition": 5, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 1, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Backpack — 35L Laptop Bag",
        "description": "35L backpack with dedicated laptop compartment (fits 15.6 inch). Multiple pockets, USB charging port on side. Used for 1 year, no damage. Perfect for college.",
        "price": 800, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 3, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    },
    {
        "title": "Humidifier — USB Mini, Night Light",
        "description": "USB mini humidifier with LED night light. Helps in dry Bhopal winters. Works for 6-8 hours on full tank. Very quiet, perfect for sleeping. Selling as gifted a bigger one.",
        "price": 800, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 7, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Electric Iron — Dry Iron 750W",
        "description": "750W dry iron with non-stick soleplate. Heats up in 30 seconds. Look presentable for college and viva! Used for 1 year. Selling as buying steam iron.",
        "price": 600, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 5, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Hot Water Rod — Immersion Heater",
        "description": "500W immersion water heater rod. Heats bucket of water in 10 minutes. Essential for winters in hostel! Safe with auto-cutoff. Selling as room has geyser now.",
        "price": 200, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 4, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Steel Water Bottle — 1L Insulated",
        "description": "1 litre stainless steel insulated water bottle. Keeps water cold for 12 hours, hot for 6 hours. Silver color. No leaks. Selling as bought branded one.",
        "price": 300, "condition": 4, "category": "Hostel Items",
        "listing_type": "sell", "seller_idx": 6, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    },
    {
        "title": "Pen Stand — Metal Mesh Desk Organizer",
        "description": "Metal mesh pen stand that holds pens, scissors, rulers, and markers. Keeps study table organized. Selling as I bought a bigger desk organizer.",
        "price": 150, "condition": 4, "category": "Stationery",
        "listing_type": "sell", "seller_idx": 3, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    },

    # ── ELECTRONICS ─────────────────────────────────────────────
    {
        "title": "Extension Board — 6 Socket with USB",
        "description": "6 socket extension board with 2 USB charging ports and surge protection. 1.5 metre wire. Perfect for hostel room with fewer sockets. Works perfectly.",
        "price": 350, "condition": 4, "category": "Electronics",
        "listing_type": "sell", "seller_idx": 4, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Mobile Charger — 20W Fast Charge",
        "description": "20W USB-C fast charger compatible with Android phones. Original quality. Cable included. Selling as I switched to iPhone. Works with OnePlus, Samsung, Xiaomi.",
        "price": 300, "condition": 5, "category": "Electronics",
        "listing_type": "sell", "seller_idx": 7, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80",
    },
    {
        "title": "Earphones — Wired with Mic",
        "description": "Wired earphones with mic, 3.5mm jack. Crystal clear sound, deep bass. Works with all phones and laptops. Selling as switched to wireless.",
        "price": 250, "condition": 4, "category": "Electronics",
        "listing_type": "sell", "seller_idx": 0, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    },
    {
        "title": "Wi-Fi Router — TP-Link 300Mbps",
        "description": "TP-Link 300Mbps WiFi router with 2 antennas. Perfect for hostel room to share LAN connection wirelessly. Works upto 50 feet range. Selling as hostel installed WiFi.",
        "price": 1200, "condition": 4, "category": "Electronics",
        "listing_type": "sell", "seller_idx": 3, "semester_tag": 4,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "JBL Bluetooth Speaker — GO 3",
        "description": "JBL GO 3 portable waterproof Bluetooth speaker. Loud clear sound for its size. 5 hours battery. Selling as bought a bigger speaker. Color: black.",
        "price": 1500, "condition": 4, "category": "Electronics",
        "listing_type": "sell", "seller_idx": 4, "semester_tag": 4,
        "image_url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    },
    {
        "title": "Pen Drive — 32GB USB 3.0",
        "description": "32GB USB 3.0 pen drive. Fast transfer speed. Perfect for submitting assignments, carrying presentations. No data on it. Selling as I use cloud now.",
        "price": 400, "condition": 5, "category": "Electronics",
        "listing_type": "sell", "seller_idx": 1, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Portable Hard Drive — 1TB Seagate",
        "description": "Seagate 1TB external hard drive. USB 3.0. Store all your college projects, movies, and data. Works perfectly. Formatted and empty. Selling as bought SSD.",
        "price": 2500, "condition": 4, "category": "Electronics",
        "listing_type": "sell", "seller_idx": 0, "semester_tag": 4,
        "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    },
    {
        "title": "ID Card Holder with Lanyard — Pack of 3",
        "description": "Pack of 3 transparent ID card holders with blue lanyards. RGPV ID card must be worn at all times! Never lose yours again. Brand new pack.",
        "price": 50, "condition": 5, "category": "Stationery",
        "listing_type": "sell", "seller_idx": 5, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },

    # ── FAN & COOLER ─────────────────────────────────────────────
    {
        "title": "Bajaj Table Fan — 3 Speed, 12 inch",
        "description": "Bajaj 12-inch table fan with 3 speed settings. Oscillates 90 degrees. Works silently. Perfect for hostel desk. Selling as hostel installed ceiling fan.",
        "price": 800, "condition": 4, "category": "Fan",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },
    {
        "title": "Symphony Air Cooler — 20L (Rent per Month)",
        "description": "Symphony 20L air cooler available for rent at ₹500/month. Beat Bhopal summer heat! Cools upto 15x15 ft room. Available May to August. Deposit ₹500 refundable.",
        "price": 500, "condition": 4, "category": "Cooler",
        "listing_type": "rent", "seller_idx": 4, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    },

    # ── BOOKS ────────────────────────────────────────────────────
    {
        "title": "Engineering Mathematics — B.S. Grewal",
        "description": "The must-have Engineering Maths book by B.S. Grewal. Covers all topics for Sem 1, 2, 3. Some solved examples highlighted. Essential for RGPV engineering students.",
        "price": 350, "condition": 4, "category": "Books",
        "listing_type": "sell", "seller_idx": 0, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    },
    {
        "title": "Computer Science Books Set — 5 Books",
        "description": "Complete set: Data Structures, Operating Systems, Computer Networks, DBMS, Theory of Computation. All 5 books for CSE core subjects. Some notes written in margins. Great for exams!",
        "price": 800, "condition": 3, "category": "Books",
        "listing_type": "sell", "seller_idx": 1, "semester_tag": 4,
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    },
    {
        "title": "Shivani Basic Mechanical Engineering — J.P. Sharma",
        "description": "Shivani publication Basic Mechanical Engineering by J.P. Sharma. Perfect for Sem 1 and 2 mechanical concepts. RGPV syllabus covered completely. Good condition.",
        "price": 280, "condition": 4, "category": "Books",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80",
    },
    {
        "title": "GATE Previous Year Papers — Mechanical 14 Years",
        "description": "GATE 2009-2022 solved papers for Mechanical Engineering. 14 years of papers with detailed solutions. Must have for GATE preparation. Light usage, mostly read only.",
        "price": 400, "condition": 4, "category": "Books",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 7,
        "image_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80",
    },
    {
        "title": "Old GATE Preparation Notes — Handwritten",
        "description": "Complete handwritten notes for GATE preparation. Topics: Engineering Maths, Aptitude, Subject-wise notes. Made by a senior who scored 98 percentile. Selling after clearing GATE.",
        "price": 500, "condition": 3, "category": "Books",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 8,
        "image_url": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80",
    },
    {
        "title": "Classmate Notebooks — Pack of 6 (200 pages each)",
        "description": "6 Classmate 200-page notebooks, single line. New pack, unused. Selling as I prefer digital notes now. Great for theory subjects and assignments.",
        "price": 120, "condition": 5, "category": "Stationery",
        "listing_type": "sell", "seller_idx": 3, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80",
    },

    # ── STATIONERY ────────────────────────────────────────────────
    {
        "title": "Pens + Highlighters Set — 10 pieces",
        "description": "Set of 5 blue pens (Reynolds), 3 highlighters (yellow, pink, green), and 2 black markers. Brand new. Perfect for semester start. Selling extra stock.",
        "price": 80, "condition": 5, "category": "Stationery",
        "listing_type": "sell", "seller_idx": 7, "semester_tag": 1,
        "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80",
    },
    {
        "title": "Stapler — Heavy Duty 24/6",
        "description": "Heavy duty stapler with 1000 staples included. Staples upto 30 pages at once. Perfect for project reports and assignments. Used only few times.",
        "price": 150, "condition": 5, "category": "Stationery",
        "listing_type": "sell", "seller_idx": 6, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80",
    },
    {
        "title": "Punching Machine — 2 Hole, 20 Sheets",
        "description": "2-hole punching machine, punches 20 sheets at once. Essential for filing practical records and lab files. Selling as department provides one now.",
        "price": 200, "condition": 4, "category": "Stationery",
        "listing_type": "sell", "seller_idx": 5, "semester_tag": 2,
        "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80",
    },

    # ── CALCULATOR ───────────────────────────────────────────────
    {
        "title": "Casio fx-991ES PLUS — Scientific Calculator",
        "description": "Casio fx-991ES PLUS with 417 functions. Approved for RGPV exams. Calculates integrals, matrices, statistics. Used for 2 semesters. All buttons responsive. Comes with slide cover.",
        "price": 650, "condition": 4, "category": "Calculator",
        "listing_type": "sell", "seller_idx": 2, "semester_tag": 3,
        "image_url": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&q=80",
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
        department_tag=seller.department,
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
print(f"✅ {count} real listings created!")
print("🎓 CampusBridge marketplace is now live with real data!")
print("🔑 All demo users password: demo1234")
