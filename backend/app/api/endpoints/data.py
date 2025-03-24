from fastapi import APIRouter
from app.core.orchestration.external_apis import get_stock_price

router = APIRouter(prefix="/data", tags=["data"])

@router.get("/stock/{symbol}")
async def get_stock(symbol: str):
    return get_stock_price(symbol.upper())