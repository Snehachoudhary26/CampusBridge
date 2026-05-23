from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ml.price_model import predict_price

router = APIRouter(prefix="/predict", tags=["Price Prediction"])

class PriceRequest(BaseModel):
    category: str
    original_price: float
    condition: int
    months_used: int
    demand_score: float = 0.5

@router.post("/price")
def get_price_prediction(request: PriceRequest):
    if request.condition < 1 or request.condition > 5:
        raise HTTPException(status_code=400, detail="Condition must be between 1 and 5")
    if request.original_price <= 0:
        raise HTTPException(status_code=400, detail="Original price must be greater than 0")
    if request.months_used < 0:
        raise HTTPException(status_code=400, detail="Months used cannot be negative")

    result = predict_price(
        category=request.category,
        original_price=request.original_price,
        condition=request.condition,
        months_used=request.months_used,
        demand_score=request.demand_score
    )

    return {
        "category": request.category,
        "original_price": request.original_price,
        "condition": request.condition,
        "months_used": request.months_used,
        "predicted_price": result["predicted_price"],
        "lower_bound": result["lower_bound"],
        "upper_bound": result["upper_bound"],
        "price_range": f"₹{result['lower_bound']:,} — ₹{result['upper_bound']:,}",
        "chart": result["chart"]
    }