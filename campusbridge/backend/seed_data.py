from database import SessionLocal, engine, Base
from models import User
from passlib.context import CryptContext

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

RGPV_SCHOOLS = {
    "School of Information Technology": {
        "courses": [
            "B.Tech CSE (AI & ML)",
            "B.Tech CSE (Data Science)",
            "B.Tech Computer Science and Business Systems",
            "M.Tech Data Science"
        ],
        "semesters": {"B.Tech": 8, "M.Tech": 4}
    },
    "University Institute of Technology": {
        "courses": [
            "B.Tech Computer Science",
            "B.Tech Information Technology",
            "B.Tech Electrical and Electronics",
            "B.Tech Electronics and Communication",
            "B.Tech Mechanical",
            "B.Tech Civil",
            "B.Tech Automobile",
            "PCT"
        ],
        "semesters": {"B.Tech": 8, "PCT": 6}
    },
    "School of Architecture": {
        "courses": ["B.Arch", "Ph.D"],
        "semesters": {"B.Arch": 10}
    },
    "School of Applied Management": {
        "courses": ["MBA"],
        "semesters": {"MBA": 4}
    },
    "School of Bio-Molecular Engineering & Biotechnology": {
        "courses": [
            "M.Tech Biomolecular Engineering and Biotechnology",
            "PGCMB",
            "Ph.D"
        ],
        "semesters": {"M.Tech": 4, "PGCMB": 2}
    },
    "School of Energy & Environment Management": {
        "courses": [
            "M.Tech Energy Technology",
            "M.Tech Energy and Environmental Engineering",
            "Ph.D"
        ],
        "semesters": {"M.Tech": 4}
    },
    "School of Nanotechnology": {
        "courses": ["M.Tech Nanotechnology", "Ph.D"],
        "semesters": {"M.Tech": 4}
    },
    "School of Pharmaceutical Sciences": {
        "courses": [
            "M.Pharm Pharmaceutical Chemistry",
            "M.Pharm Pharmaceutics",
            "M.Pharm Pharmaceutical Quality Assurance",
            "Ph.D in Pharmacy"
        ],
        "semesters": {"M.Pharm": 4}
    }
}

CATEGORIES = [
    "Books",
    "Laptop",
    "Calculator",
    "Drawing Instruments",
    "Stationery",
    "Fan",
    "Cooler",
    "Hostel Items",
    "Electronics",
    "Other"
]

def seed():
    db = SessionLocal()
    print("Database tables created successfully.")
    print("RGPV Schools and courses loaded:")
    for school, data in RGPV_SCHOOLS.items():
        print(f"  {school}: {len(data['courses'])} courses")
    print(f"Categories available: {', '.join(CATEGORIES)}")
    print("Seed complete. Ready for Day 2.")
    db.close()

if __name__ == "__main__":
    seed()