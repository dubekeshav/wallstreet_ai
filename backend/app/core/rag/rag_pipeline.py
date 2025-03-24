from app.core.embedding.embedding_service import generate_embeddings
from app.core.llm.llm_service import generate_response
from app.core.vector_database.vector_db_service import retrieve_relevant_knowledge
from app.core.orchestration.external_apis import get_stock_price, search_stock_symbol
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clean_company_name(name):
    """Clean company name by removing extra words and whitespace"""
    # Remove common suffixes
    name = re.sub(r'\s+(?:stock|share|price|current|right now)\s*$', '', name, flags=re.IGNORECASE)
    # Remove leading/trailing whitespace
    return name.strip()

def is_stock_price_query(query):
    """Check if the query is asking for a stock price"""
    price_patterns = [
        r"(?:price of|current price of|stock price of)\s+([^?.]+?)(?:\s+stock|\s+right now|\s+currently|\?|$)",
        r"(?:what(?:'s| is) the (?:price|current price|stock price) of)\s+([^?.]+?)(?:\s+stock|\s+right now|\s+currently|\?|$)",
        r"how much (?:is|does)\s+([^?.]+?)(?:\s+stock|\s+share|\s+cost|\s+trading for|\?|$)"
    ]
    return any(re.search(pattern, query, re.IGNORECASE) for pattern in price_patterns)

def rag_pipeline(query):
    logger.info(f"[RAG] Processing query: {query}")
    stock_ticker = None
    company_name = None

    # Check if this is a stock price query
    if is_stock_price_query(query):
        # Extract company name using the first matching pattern
        for pattern in [
            r"(?:price of|current price of|stock price of)\s+([^?.]+?)(?:\s+stock|\s+right now|\s+currently|\?|$)",
            r"(?:what(?:'s| is) the (?:price|current price|stock price) of)\s+([^?.]+?)(?:\s+stock|\s+right now|\s+currently|\?|$)",
            r"how much (?:is|does)\s+([^?.]+?)(?:\s+stock|\s+share|\s+cost|\s+trading for|\?|$)"
        ]:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                company_name = clean_company_name(match.group(1))
                logger.info(f"[RAG] Detected company name: {company_name}")
                break

        if company_name:
            # Always search for the stock symbol first
            logger.info(f"[RAG] Searching for stock symbol for: {company_name}")
            search_results = search_stock_symbol(company_name)
            
            if isinstance(search_results, list) and search_results:
                # Try to find the best match
                best_match = None
                max_relevance = -1

                for result in search_results:
                    symbol = result.get("1. symbol")
                    name = result.get("2. name", "").upper()
                    type = result.get("3. type")
                    relevance = float(result.get("8. matchScore", 0)) if result.get("8. matchScore") else 0

                    # Check if the company name is part of the result name
                    company_words = set(company_name.upper().split())
                    name_words = set(name.split())
                    word_match = any(word in name_words for word in company_words)

                    if word_match and "Stock" in type:
                        if relevance > max_relevance:
                            max_relevance = relevance
                            best_match = result

                if best_match:
                    stock_ticker = best_match.get("1. symbol")
                    company_name = best_match.get("2. name")
                    logger.info(f"[RAG] Found matching symbol: {stock_ticker} ({company_name})")
                else:
                    # Fallback to first result if no good match found
                    first_match = search_results[0]
                    stock_ticker = first_match.get("1. symbol")
                    company_name = first_match.get("2. name")
                    logger.info(f"[RAG] Using fallback symbol: {stock_ticker} ({company_name})")

                # If we have a ticker, get the live price
                if stock_ticker:
                    logger.info(f"[RAG] Fetching live price for {stock_ticker}")
                    live_price_data = get_stock_price(stock_ticker)
                    logger.info(f"[RAG] Live price data: {live_price_data}")

                    if "price" in live_price_data:
                        price = live_price_data["price"]
                        change = live_price_data.get("change")
                        change_percent = live_price_data.get("change_percent")
                        
                        # Format the response with price change information
                        response = f"The current stock price of {company_name} ({stock_ticker}) is ${price:,.2f}"
                        if change is not None:
                            change_sign = "+" if change > 0 else ""
                            response += f" ({change_sign}{change:,.2f}"
                            if change_percent:
                                response += f", {change_percent}"
                            response += ")"
                        response += "."
                        return response
                    else:
                        error_msg = live_price_data.get("error", "Could not retrieve the current stock price")
                        logger.error(f"[RAG] Error getting price: {error_msg}")
                        return f"I apologize, but I couldn't retrieve the current stock price for {company_name} ({stock_ticker}). This might be due to market hours or temporary API limitations."
            else:
                error_msg = search_results.get("error", "Could not find any matching symbols")
                logger.error(f"[RAG] Error finding symbol: {error_msg}")
                return f"I apologize, but I couldn't find a matching stock symbol for '{company_name}'. Please try using the company's full name or ticker symbol."

    # For non-stock price queries or if we couldn't find a stock ticker
    relevant_knowledge = retrieve_relevant_knowledge(query)
    logger.info(f"[RAG] Retrieved {len(relevant_knowledge)} relevant knowledge items")

    texts = [doc['text'] for doc in relevant_knowledge]
    sources = [doc['source_file'] for doc in relevant_knowledge]
    unique_sources = list(set(sources))

    context = "\n".join(texts)
    prompt = f"""You are a financial advisor. Based on the provided financial context, answer the user's question.
If the answer cannot be found within the context, state clearly that you don't have enough information to answer the question.

Context:
{context}

Question: {query}

Answer:"""
    
    try:
        response = generate_response(prompt)
        if sources:
            response += f"\n\nSources:\n" + "\n".join(f"- {source}" for source in unique_sources)
        return response
    except Exception as e:
        logger.error(f"[RAG] Error generating response: {str(e)}")
        return "I apologize, but I encountered an error while processing your request. Please try again later."