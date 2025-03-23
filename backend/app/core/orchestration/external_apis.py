import requests
import pandas as pd
from app.config import ALPHA_VANTAGE_API_KEY

'''
TODO: 
- Add similar functions for gold price, mutual fund prices, technical indicators, crypto prices etc.
'''

def get_stock_price(symbol: str):
    if not ALPHA_VANTAGE_API_KEY:
        return {"error": "Alpha Vantage API key not configured"}
    url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url) 
        # Raise an exception for bad status codes
        response.raise_for_status()
        data = response.json()
        
        if "Global Quote" in data and data["Global Quote"]:
            return {"price": data["Global Quote"]["05. price"]}
        else:
            return {"error": f"Could not retrieve price for {symbol}"}
    except requests.excpetions.RequestException as e:
        return {"error": f"Error fetching data: {e}"}
    except Exception as e:
        return {"error": "Something went wrong."}

def get_multiple_stock_prices(symbols: list[str]):
    if not ALPHA_VANTAGE_API_KEY:
        return {"error": "Alpha Vantage API key not configured"}
    url = f"https://www.alphavantage.co/query?function=REALTIME_BULK_QUOTES&symbol={",".join(symbols)}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url)
        # Raise an exception for bad status codes
        response.raise_for_status()
        data = response.json()
        
        if "Global Quote" in data and data["Global Quote"]:
            return {symbol: {"price": data["Global Quote"]["05. price"]} for symbol in symbols}
        else:
            return {"error": "Could not retrieve prices for all the symbols"}
    except requests.exception.RequestException as e:
        return {"error": f"Error fetching data: {e}"}
    except Exception as e:
        return {"error": "Something went wrong"}
    
