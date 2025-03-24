from app.core.orchestration.external_apis import search_stock_symbol
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_stock_search():
    # Test cases
    test_cases = [
        "Apple",  # Company name
        "AAPL",   # Direct symbol
        "Microsoft",
        "MSFT",
        "Tesla",
        "TSLA",
        "Google",
        "GOOGL",
        "Amazon",
        "AMZN"
    ]
    
    logger.info("[Test] Starting stock symbol search tests")
    
    for test_query in test_cases:
        logger.info(f"\n[Test] Searching for: {test_query}")
        try:
            results = search_stock_symbol(test_query)
            
            if isinstance(results, list) and results:
                logger.info(f"[Test] Found {len(results)} results")
                # Print first 3 results
                for i, result in enumerate(results[:3]):
                    logger.info(f"\n[Test] Result {i+1}:")
                    logger.info(f"Symbol: {result.get('1. symbol', 'N/A')}")
                    logger.info(f"Name: {result.get('2. name', 'N/A')}")
                    logger.info(f"Type: {result.get('3. type', 'N/A')}")
                    logger.info(f"Region: {result.get('4. region', 'N/A')}")
                    logger.info(f"Market Open: {result.get('5. marketOpen', 'N/A')}")
                    logger.info(f"Market Close: {result.get('6. marketClose', 'N/A')}")
                    logger.info(f"Timezone: {result.get('7. timezone', 'N/A')}")
                    logger.info(f"Match Score: {result.get('8. matchScore', 'N/A')}")
            elif isinstance(results, dict) and "error" in results:
                logger.error(f"[Test] Error: {results['error']}")
            else:
                logger.warning(f"[Test] No results found for '{test_query}'")
                
        except Exception as e:
            logger.error(f"[Test] Exception while searching for '{test_query}': {str(e)}")
    
    logger.info("\n[Test] Stock symbol search tests completed")

if __name__ == "__main__":
    test_stock_search() 