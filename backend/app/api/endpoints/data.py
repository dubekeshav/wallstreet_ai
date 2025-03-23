from fastapi import APIRouter
from app.core.orchestration.external_apis import get_stock_price, get_multiple_stock_prices

router = APIRouter(prefix="/data", tags=["data"])

@router.get("/stock/{symbol}")
async def get_stock(symbol: str):
    return get_stock_price(symbol.upper())

@router.get("/stocks")
async def get_stocks(symbols: list[str]):
    return get_multiple_stock_prices([symbol.upper() for symbol in symbols])
