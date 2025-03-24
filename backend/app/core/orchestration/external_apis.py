import requests
import pandas as pd
from app.config import ALPHA_VANTAGE_API_KEY  # Assuming you'll store API keys here
import logging
import time

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Rate limiting
last_request_time = 0
MIN_REQUEST_INTERVAL = 12  # Alpha Vantage free tier limit: 5 requests per minute

def _rate_limit():
    global last_request_time
    current_time = time.time()
    time_since_last_request = current_time - last_request_time
    if time_since_last_request < MIN_REQUEST_INTERVAL:
        sleep_time = MIN_REQUEST_INTERVAL - time_since_last_request
        logger.debug(f"[StockAPI] Rate limiting: sleeping for {sleep_time:.2f} seconds")
        time.sleep(sleep_time)
    last_request_time = time.time()

def get_stock_price(symbol):
    logger.debug(f"[StockAPI] Getting price for symbol: {symbol}")
    if not ALPHA_VANTAGE_API_KEY:
        logger.error("[StockAPI] Alpha Vantage API key not configured")
        return {"error": "Alpha Vantage API key not configured"}
        
    if not symbol or not isinstance(symbol, str):
        return {"error": "Invalid symbol provided"}
        
    _rate_limit()
    url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    logger.debug(f"[StockAPI] Making request to: {url}")
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"[StockAPI] Response data: {data}")
        
        # Check for API errors
        if "Note" in data:
            error_msg = f"API rate limit reached: {data['Note']}"
            logger.error(f"[StockAPI] {error_msg}")
            return {"error": error_msg}
        if "Error Message" in data:
            error_msg = f"API error: {data['Error Message']}"
            logger.error(f"[StockAPI] {error_msg}")
            return {"error": error_msg}
            
        if "Global Quote" in data and data["Global Quote"]:
            quote = data["Global Quote"]
            price = quote.get("05. price")
            change = quote.get("09. change")
            change_percent = quote.get("10. change percent")
            
            if price and price != "0.0000":
                logger.info(f"[StockAPI] Successfully retrieved price for {symbol}: ${price}")
                return {
                    "price": float(price),
                    "change": float(change) if change else None,
                    "change_percent": change_percent if change_percent else None
                }
            else:
                logger.error(f"[StockAPI] Zero or invalid price for {symbol}")
                return {"error": f"Could not retrieve valid price for {symbol}"}
        else:
            logger.error(f"[StockAPI] No data found for {symbol}. Response: {data}")
            return {"error": f"Could not retrieve price for {symbol}"}
            
    except requests.exceptions.RequestException as e:
        logger.error(f"[StockAPI] Error fetching data: {str(e)}")
        return {"error": f"Error fetching data: {e}"}
    except (ValueError, TypeError) as e:
        logger.error(f"[StockAPI] Error parsing response: {str(e)}")
        return {"error": f"Error parsing response: {e}"}
    
def search_stock_symbol(keyword):
    logger.debug(f"[StockAPI] Searching for symbol with keyword: {keyword}")
    if not ALPHA_VANTAGE_API_KEY:
        logger.error("[StockAPI] Alpha Vantage API key not configured")
        return {"error": "Alpha Vantage API key not configured"}
        
    if not keyword or not isinstance(keyword, str):
        return {"error": "Invalid search keyword"}
        
    _rate_limit()
    url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keyword}&apikey={ALPHA_VANTAGE_API_KEY}"
    logger.debug(f"[StockAPI] Making request to: {url}")
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        logger.debug(f"[StockAPI] Response data: {data}")
        
        # Check for API errors
        if "Note" in data:
            error_msg = f"API rate limit reached: {data['Note']}"
            logger.error(f"[StockAPI] {error_msg}")
            return {"error": error_msg}
        if "Error Message" in data:
            error_msg = f"API error: {data['Error Message']}"
            logger.error(f"[StockAPI] {error_msg}")
            return {"error": error_msg}
            
        if "bestMatches" in data and data["bestMatches"]:
            matches = data["bestMatches"]
            logger.info(f"[StockAPI] Found {len(matches)} matches for '{keyword}'")
            return matches
        else:
            logger.error(f"[StockAPI] No matches found for '{keyword}'. Response: {data}")
            return {"error": f"Could not find any matching symbols for '{keyword}'"}
            
    except requests.exceptions.RequestException as e:
        logger.error(f"[StockAPI] Error fetching data: {str(e)}")
        return {"error": f"Error fetching data: {e}"}
    except (ValueError, TypeError) as e:
        logger.error(f"[StockAPI] Error parsing response: {str(e)}")
        return {"error": f"Error parsing response: {e}"}

# Add similar functions for gold price, mutual fund price, technical indicators etc.
# You might need to explore free APIs for these.