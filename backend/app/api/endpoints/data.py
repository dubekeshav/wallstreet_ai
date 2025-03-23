
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging
from ...core.orchestration.external_apis import fetch_stock_data, fetch_market_news, fetch_economic_indicators

router = APIRouter()
logger = logging.getLogger(__name__)

class StockDataResponse(BaseModel):
    symbol: str
    name: str
    data: List[Dict[str, Any]]
    current_price: float
    change_percent: float
    market_cap: Optional[float] = None


@router.get("/stocks/{symbol}", response_model=StockDataResponse)
async def get_stock_data(symbol: str, period: str = Query("1m", description="Time period (1d, 1w, 1m, 3m, 6m, 1y, 5y)")):
    try:
        data = fetch_stock_data(symbol, period)
        if not data:
            raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
        return data
    except Exception as e:
        logger.error(f"Error fetching stock data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market-news")
async def get_market_news(category: str = Query("general", description="News category (general, stocks, crypto, forex)")):
    try:
        news = fetch_market_news(category)
        return {"news": news}
    except Exception as e:
        logger.error(f"Error fetching market news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/economic-indicators")
async def get_economic_indicators():
    try:
        indicators = fetch_economic_indicators()
        return {"indicators": indicators}
    except Exception as e:
        logger.error(f"Error fetching economic indicators: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
