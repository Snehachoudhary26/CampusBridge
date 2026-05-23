from fastapi import APIRouter

router = APIRouter(prefix="/categories", tags=["Categories"])

CATEGORIES = [
    {"id": 1, "name": "Books", "icon": "📚", "description": "Textbooks, novels, reference books"},
    {"id": 2, "name": "Laptop", "icon": "💻", "description": "Laptops and accessories"},
    {"id": 3, "name": "Calculator", "icon": "🔢", "description": "Scientific and graphing calculators"},
    {"id": 4, "name": "Drawing Instruments", "icon": "📐", "description": "Drafters, T-squares, compasses"},
    {"id": 5, "name": "Stationery", "icon": "✏️", "description": "Pens, notebooks, folders"},
    {"id": 6, "name": "Fan", "icon": "🌀", "description": "Table fans, ceiling fans"},
    {"id": 7, "name": "Cooler", "icon": "❄️", "description": "Air coolers for hostel rooms"},
    {"id": 8, "name": "Hostel Items", "icon": "🏠", "description": "Bedding, utensils, storage"},
    {"id": 9, "name": "Electronics", "icon": "🔌", "description": "Headphones, chargers, gadgets"},
    {"id": 10, "name": "Other", "icon": "📦", "description": "Everything else"}
]

SCHOOLS = [
    {
        "id": 1,
        "name": "School of Information Technology",
        "departments": [
            "B.Tech CSE (AI & ML)",
            "B.Tech CSE (Data Science)",
            "B.Tech Computer Science and Business Systems",
            "M.Tech Data Science"
        ],
        "semesters": 8
    },
    {
        "id": 2,
        "name": "University Institute of Technology",
        "departments": [
            "B.Tech Computer Science",
            "B.Tech Information Technology",
            "B.Tech Electrical and Electronics",
            "B.Tech Electronics and Communication",
            "B.Tech Mechanical",
            "B.Tech Civil",
            "B.Tech Automobile",
            "PCT"
        ],
        "semesters": 8
    },
    {
        "id": 3,
        "name": "School of Architecture",
        "departments": ["B.Arch", "Ph.D"],
        "semesters": 10
    },
    {
        "id": 4,
        "name": "School of Applied Management",
        "departments": ["MBA"],
        "semesters": 4
    },
    {
        "id": 5,
        "name": "School of Bio-Molecular Engineering & Biotechnology",
        "departments": [
            "M.Tech Biomolecular Engineering and Biotechnology",
            "PGCMB",
            "Ph.D"
        ],
        "semesters": 4
    },
    {
        "id": 6,
        "name": "School of Energy & Environment Management",
        "departments": [
            "M.Tech Energy Technology",
            "M.Tech Energy and Environmental Engineering",
            "Ph.D"
        ],
        "semesters": 4
    },
    {
        "id": 7,
        "name": "School of Nanotechnology",
        "departments": ["M.Tech Nanotechnology", "Ph.D"],
        "semesters": 4
    },
    {
        "id": 8,
        "name": "School of Pharmaceutical Sciences",
        "departments": [
            "M.Pharm Pharmaceutical Chemistry",
            "M.Pharm Pharmaceutics",
            "M.Pharm Pharmaceutical Quality Assurance",
            "Ph.D in Pharmacy"
        ],
        "semesters": 4
    }
]

LISTING_TYPES = [
    {"id": "sell", "label": "Sell", "description": "Permanently sell your item"},
    {"id": "rent", "label": "Rent", "description": "Rent your item for a period"},
    {"id": "borrow", "label": "Borrow", "description": "Lend your item temporarily"},
    {"id": "swap", "label": "Skill Swap", "description": "Exchange for a skill or service"}
]

@router.get("/")
def get_categories():
    return {"categories": CATEGORIES}

@router.get("/schools")
def get_schools():
    return {"schools": SCHOOLS}

@router.get("/listing-types")
def get_listing_types():
    return {"listing_types": LISTING_TYPES}

@router.get("/semesters/{school_id}")
def get_semesters(school_id: int):
    school = next((s for s in SCHOOLS if s["id"] == school_id), None)
    if not school:
        return {"semesters": list(range(1, 9))}
    return {"semesters": list(range(1, school["semesters"] + 1))}