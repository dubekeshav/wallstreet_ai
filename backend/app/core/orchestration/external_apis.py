
from typing import Dict, List, Any, Optional
import random
from datetime import datetime, timedelta

def fetch_stock_data(symbol: str, period: str = "1m") -> Dict[str, Any]:
    """
    Fetch stock data for a particular symbol
    
    In a real implementation, this would connect to a financial API
    such as Alpha Vantage, Yahoo Finance, or Financial Modeling Prep
    """
    # Mock data generation
    start_price = random.uniform(50, 200)
    current_price = start_price * random.uniform(0.8, 1.2)
    change_percent = ((current_price - start_price) / start_price) * 100
    
    # Generate mock historical data
    days = 30
    if period == "1w":
        days = 7
    elif period == "3m":
        days = 90
    elif period == "6m":
        days = 180
    elif period == "1y":
        days = 365
    
    data = []
    price = start_price
    for i in range(days):
        date = (datetime.now() - timedelta(days=days-i)).strftime('%Y-%m-%d')
        price = price * random.uniform(0.98, 1.02)  # Daily volatility
        volume = int(random.uniform(100000, 5000000))
        
        data.append({
            "date": date,
            "price": round(price, 2),
            "volume": volume
        })
    
    return {
        "symbol": symbol,
        "name": f"{symbol} Corporation",
        "data": data,
        "current_price": round(current_price, 2),
        "change_percent": round(change_percent, 2),
        "market_cap": round(current_price * random.uniform(1000000, 10000000000), 2)
    }

def fetch_market_news(category: str = "general") -> List[Dict[str, Any]]:
    """
    Fetch financial news
    
    In a real implementation, this would connect to a news API
    such as NewsAPI, Bloomberg, or Alpha Vantage News
    """
    # Mock news data
    news_items = [
        {
            "title": "Federal Reserve Maintains Interest Rates",
            "source": "Financial Times",
            "url": "https://example.com/fed-rates",
            "published_at": (datetime.now() - timedelta(hours=3)).isoformat(),
            "summary": "The Federal Reserve has decided to maintain current interest rates following their latest meeting."
        },
        {
            "title": "Tech Stocks Rally on Positive Earnings Reports",
            "source": "Wall Street Journal",
            "url": "https://example.com/tech-rally",
            "published_at": (datetime.now() - timedelta(hours=8)).isoformat(),
            "summary": "Major tech companies reported better than expected earnings, driving a market rally."
        },
        {
            "title": "Oil Prices Surge Amid Middle East Tensions",
            "source": "Bloomberg",
            "url": "https://example.com/oil-prices",
            "published_at": (datetime.now() - timedelta(days=1)).isoformat(),
            "summary": "Crude oil prices increased by 3% today due to escalating geopolitical tensions."
        }
    ]
    
    return news_items

def fetch_economic_indicators() -> Dict[str, Any]:
    """
    Fetch key economic indicators
    
    In a real implementation, this would connect to an economic data API
    such as FRED, World Bank API, or similar sources
    """
    # Mock economic indicators
    indicators = {
        "gdp_growth": random.uniform(1.5, 4.2),
        "unemployment_rate": random.uniform(3.2, 5.8),
        "inflation_rate": random.uniform(1.8, 3.5),
        "interest_rate": random.uniform(0.1, 1.5),
        "consumer_confidence": random.uniform(80, 110),
        "last_updated": datetime.now().isoformat()
    }
    
    return indicators
