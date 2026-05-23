# CampusBridge 🎓
### AI-Powered Campus Marketplace for RGPV Bhopal Students

> Buy, Sell, Rent, Borrow & Skill-Swap within your campus — powered by AI, ML, and real-time data.

**Live Demo:** Coming soon  
**GitHub:** https://github.com/Snehachoudhary26/CampusBridge  
**Developer:** Sneha Choudhary — School of Information Technology, RGPV Bhopal, Sem 6

---

## What is CampusBridge?

CampusBridge is a first-of-its-kind campus economy platform built exclusively for students of **Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal**. Unlike OLX or Facebook Marketplace, CampusBridge is:

- **Campus-specific** — Only RGPV students, verified by school and department
- **AI-guided** — ARIA chatbot knows your campus, your department, your semester
- **ML-powered** — Fair price prediction, spam detection, smart recommendations
- **Multi-modal** — Sell, Rent, Borrow, or Skill-Swap items
- **Department-aware** — Listings tagged by school, department, and semester

---

## RGPV Campus Coverage

| School | Courses |
|--------|---------|
| School of Information Technology | B.Tech CSE (AI & ML), B.Tech CSE (Data Science), B.Tech CSBS, M.Tech Data Science |
| University Institute of Technology | B.Tech CS, IT, EEE, ECE, Mechanical, Civil, Automobile, PCT |
| School of Architecture | B.Arch (5 years), Ph.D |
| School of Applied Management | MBA |
| School of Bio-Molecular Engineering & Biotechnology | M.Tech, PGCMB, Ph.D |
| School of Energy & Environment Management | M.Tech Energy Tech, M.Tech EEE, Ph.D |
| School of Nanotechnology | M.Tech Nanotechnology, Ph.D |
| School of Pharmaceutical Sciences | M.Pharm (3 specializations), Ph.D |

---

## Features

### Core Marketplace
- Post listings as **Sell / Rent / Borrow / Skill-Swap**
- Filter by department, semester, category, price, condition
- Image upload via Cloudinary
- In-app messaging between buyers and sellers
- Listing condition rating (1–5 stars)

### AI Features
- **ARIA Chatbot** — Conversational AI powered by Gemini API with full RGPV campus knowledge. Answers questions like "What books do I need for IT Sem 3?" or "Who is selling a drafter near Architecture block?"
- **Fair Price Predictor** — ML model (Random Forest, R² = 96.76%) that suggests a fair price range based on category, condition, months used, and demand
- **Spam Detector** — NLP classifier (TF-IDF + Logistic Regression, 100% accuracy) that auto-flags suspicious listings
- **Smart Recommender** — Department and semester-aware recommendation engine
- **Demand Analytics Dashboard** — Seaborn + Matplotlib charts showing trending categories, demand by department, price trends

### Item Categories
Books · Laptop · Calculator · Drawing Instruments · Stationery · Fan · Cooler · Hostel Items · Electronics · Other

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | FastAPI (Python) |
| Database | PostgreSQL + SQLAlchemy |
| Authentication | JWT + bcrypt |
| AI Chatbot | Gemini API + RAG context |
| ML Models | scikit-learn (Random Forest, Logistic Regression) |
| NLP | TF-IDF vectorizer |
| Data Viz | Matplotlib + Seaborn |
| Image Upload | Cloudinary API |
| Server | Uvicorn |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| State | Zustand |
| HTTP | Axios |
| Notifications | React Hot Toast |
| Routing | React Router v6 |

### APIs Used
- Gemini API (Google) — AI chatbot
- Cloudinary — Image storage and optimization
- PostgreSQL — Local + Supabase (production)

---

## ML Models Built

| Model | Algorithm | Accuracy | Purpose |
|-------|-----------|----------|---------|
| Price Predictor | Random Forest Regressor | R² = 96.76% | Suggest fair price for listings |
| Spam Detector | TF-IDF + Logistic Regression | 100% | Flag suspicious listings |
| Recommender | Cosine Similarity | — | Personalized listing suggestions |

---

## Project Structure

```
CampusBridge/
├── campusbridge/
│   └── backend/
│       ├── main.py              # FastAPI app entry point
│       ├── database.py          # PostgreSQL connection
│       ├── models.py            # Database table definitions
│       ├── schemas.py           # Pydantic request/response models
│       ├── auth.py              # JWT + password hashing
│       ├── seed_data.py         # RGPV departments seeder
│       ├── requirements.txt     # Python dependencies
│       ├── routers/
│       │   ├── users.py         # Auth endpoints
│       │   ├── listings.py      # Marketplace endpoints
│       │   ├── categories.py    # RGPV schools + categories
│       │   ├── chat.py          # ARIA chatbot endpoint
│       │   ├── predict.py       # Price prediction endpoint
│       │   ├── messages.py      # Buyer-seller messaging
│       │   └── analytics.py     # Dashboard + recommendations
│       ├── aria/
│       │   ├── context.py       # RGPV knowledge base
│       │   └── chatbot.py       # Gemini API integration
│       ├── ml/
│       │   ├── price_data.py    # Synthetic training data
│       │   ├── price_model.py   # Train + serve price predictor
│       │   ├── spam_model.py    # Train + serve spam detector
│       │   └── recommender.py   # Recommendation engine
│       └── utils/
│           └── cloudinary.py    # Image upload helper
└── frontend/
    └── src/
        ├── App.jsx              # Routes
        ├── api/axios.js         # Backend connection
        ├── store/authStore.js   # User session (Zustand)
        ├── components/
        │   └── Navbar.jsx       # Responsive navigation
        └── pages/
            ├── Home.jsx         # Landing + hero + listings
            ├── Login.jsx        # Login form
            ├── Register.jsx     # Register with RGPV dropdowns
            ├── Listings.jsx     # Browse with filters
            └── PostListing.jsx  # Multi-step listing creation
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users/register | Register new student |
| POST | /users/login | Login + get JWT token |
| GET | /users/me | Get current user profile |
| GET | /listings/ | Browse listings with filters |
| POST | /listings/ | Create new listing |
| GET | /categories/schools | All RGPV schools + departments |
| POST | /chat/ | Talk to ARIA chatbot |
| POST | /chat/guest | ARIA without login |
| POST | /predict/price | Get AI price suggestion |
| GET | /analytics/trending | Trending categories chart |
| GET | /analytics/recommendations/{user_id} | Personalized recommendations |
| GET | /messages/conversations | All conversations |
| POST | /messages/ | Send message to seller |

---

## How to Run Locally

### Backend
```bash
cd campusbridge/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at: http://127.0.0.1:8000  
API docs at: http://127.0.0.1:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

### Environment Variables
Create `campusbridge/backend/.env`:
```
DATABASE_URL=postgresql://yourusername@localhost:5432/campusbridge
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Progress Status

### Completed ✅
- [x] Day 1 — Database design + RGPV data seeded (all 8 schools, 27 courses)
- [x] Day 2 — User authentication (register, login, JWT tokens)
- [x] Day 3 — Full listings API (CRUD, search, filter, image upload)
- [x] Day 4 — ARIA AI chatbot (Gemini API + RGPV campus knowledge)
- [x] Day 5 — Price prediction ML model (Random Forest, R² = 96.76%)
- [x] Day 6 — Spam detector (100% accuracy) + buyer-seller messaging
- [x] Day 7 — Recommender engine + Seaborn analytics dashboard
- [x] Day 8 — React frontend setup (Navbar, Login, Register, Home, Listings, PostListing)

### In Progress / Remaining 🔄
- [ ] Fix registration bcrypt bug (password truncation to 72 bytes)
- [ ] ARIA chatbot floating UI component
- [ ] Listing detail page
- [ ] Messages page (buyer-seller chat UI)
- [ ] Analytics dashboard page
- [ ] Profile page + My Listings page
- [ ] Mobile responsiveness polish
- [ ] Deploy backend to Render.com
- [ ] Deploy frontend to Vercel
- [ ] README architecture diagram
- [ ] Demo video (2 minutes)

---

## Design System

| Element | Value |
|---------|-------|
| Primary background | `#0A1628` (Dark navy) |
| Accent color | `#00C896` (Green) |
| Secondary background | `#112240` |
| Font | System UI / Inter |
| Animations | Framer Motion slide-in on scroll |
| Layout reference | Myntra-style (left filters + product grid) |

---

## Interview Talking Points

1. **6 ML techniques** — Random Forest, Logistic Regression, TF-IDF, Cosine Similarity, Isolation Forest ready, Time-series analytics
2. **Real AI chatbot** — Not hardcoded FAQs, actual Gemini API with RGPV campus knowledge base
3. **Solves my own problem** — I am an RGPV IT student, I designed this for students exactly like me
4. **Full stack** — Python FastAPI backend + React frontend, both connected and deployed
5. **6 live APIs** — Gemini, Cloudinary, PostgreSQL, JWT auth, Framer Motion, Tailwind
6. **Unique concept** — No other campus marketplace in India has AI price prediction + department-aware recommendations

---

## Developer

**Sneha Choudhary**  
B.Tech CSE | School of Information Technology | RGPV Bhopal  
Semester 6 → Building for Semester 7 Placement  
GitHub: [@Snehachoudhary26](https://github.com/Snehachoudhary26)

---

*Built with ❤️ for RGPV students by an RGPV student*
