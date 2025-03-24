import requests
import pandas as pd
from app.config import ALPHA_VANTAGE_API_KEY  # Assuming you'll store API keys here

def get_stock_price(symbol):
    if not ALPHA_VANTAGE_API_KEY:
        return {"error": "Alpha Vantage API key not configured"}
    url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        if "Global Quote" in data and data["Global Quote"]:
            return {"price": data['Global Quote']['05. price']}
        else:
            return {"error": f"Could not retrieve price for {symbol}"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Error fetching data: {e}"}
    
def search_stock_symbol(keyword):
    if not ALPHA_VANTAGE_API_KEY:
        return {"error": "Alpha Vantage API key not configured"}
    url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keyword}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        if "bestMatches" in data and data["bestMatches"]:
            return data["bestMatches"]
        else:
            return {"error": f"Could not find any matching symbols for '{keyword}'"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Error fetching data: {e}"}

# Add similar functions for gold price, mutual fund price, technical indicators etc.
# You might need to explore free APIs for these.