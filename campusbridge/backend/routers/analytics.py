from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Listing, User
from auth import get_current_user
from ml.recommender import get_recommendations
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from io import BytesIO
import pandas as pd

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def fig_to_base64(fig):
    buffer = BytesIO()
    fig.savefig(buffer, format="png", dpi=100, bbox_inches="tight")
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close(fig)
    return f"data:image/png;base64,{img_base64}"

@router.get("/trending")
def get_trending(db: Session = Depends(get_db)):
    results = db.query(
        Listing.category,
        func.count(Listing.id).label("count")
    ).filter(
        Listing.is_active == True,
        Listing.is_flagged == False
    ).group_by(Listing.category).order_by(func.count(Listing.id).desc()).all()

    if not results:
        return {"message": "No data yet", "chart": None, "data": []}

    categories = [r.category for r in results]
    counts = [r.count for r in results]

    fig, ax = plt.subplots(figsize=(8, 4))
    colors = ["#00C896" if i == 0 else "#0A4D68" for i in range(len(categories))]
    bars = ax.bar(categories, counts, color=colors, edgecolor="none", width=0.6)

    for bar, count in zip(bars, counts):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.1,
                str(count), ha="center", va="bottom", fontsize=9, color="#333")

    ax.set_facecolor("#F8FFFE")
    fig.patch.set_facecolor("#F8FFFE")
    ax.set_title("Trending Categories on CampusBridge", fontsize=12, fontweight="bold", color="#0A1628")
    ax.set_xlabel("Category", fontsize=9, color="#555")
    ax.set_ylabel("Number of Listings", fontsize=9, color="#555")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    plt.xticks(rotation=30, ha="right", fontsize=8)
    plt.tight_layout()

    return {
        "data": [{"category": c, "count": n} for c, n in zip(categories, counts)],
        "chart": fig_to_base64(fig)
    }

@router.get("/demand")
def get_demand_by_department(db: Session = Depends(get_db)):
    results = db.query(
        Listing.department_tag,
        func.count(Listing.id).label("count")
    ).filter(
        Listing.is_active == True,
        Listing.department_tag != None
    ).group_by(Listing.department_tag).order_by(func.count(Listing.id).desc()).limit(8).all()

    if not results:
        return {"message": "No data yet", "chart": None, "data": []}

    departments = [r.department_tag[:20] + "..." if len(r.department_tag) > 20 else r.department_tag for r in results]
    counts = [r.count for r in results]

    fig, ax = plt.subplots(figsize=(8, 4))
    sns.barplot(x=counts, y=departments, palette="Blues_d", ax=ax)
    ax.set_facecolor("#F8FFFE")
    fig.patch.set_facecolor("#F8FFFE")
    ax.set_title("Demand by Department", fontsize=12, fontweight="bold", color="#0A1628")
    ax.set_xlabel("Number of Listings", fontsize=9)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    plt.tight_layout()

    return {
        "data": [{"department": r.department_tag, "count": r.count} for r in results],
        "chart": fig_to_base64(fig)
    }

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_listings = db.query(func.count(Listing.id)).filter(Listing.is_active == True).scalar()
    total_users = db.query(func.count(User.id)).scalar()
    total_categories = db.query(func.count(Listing.category.distinct())).scalar()
    avg_price = db.query(func.avg(Listing.price)).filter(Listing.is_active == True).scalar()

    return {
        "total_listings": total_listings or 0,
        "total_users": total_users or 0,
        "total_categories": total_categories or 0,
        "average_price": round(float(avg_price), 2) if avg_price else 0
    }

@router.get("/recommendations/{user_id}")
def get_user_recommendations(
    user_id: int,
    db: Session = Depends(get_db)
):
    recommendations = get_recommendations(user_id, db)
    return {
        "user_id": user_id,
        "recommendations": recommendations,
        "count": len(recommendations)
    }