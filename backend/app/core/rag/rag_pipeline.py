from app.core.embedding.embedding_service import generate_embeddings
from app.core.llm.llm_service import generate_response
from app.core.vector_database.vector_db_service import retrieve_relevant_knowledge
from app.core.orchestration.external_apis import get_stock_price, search_stock_symbol
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ... (Previous imports and function definitions for `get_stock_price` and `retrieve_relevant_knowledge`)

def rag_pipeline(query):
    print(f"[RAG] Retrieving relevant knowledge for query: {query}")
    stock_ticker = None
    company_name_attempt = None
    match = re.search(r"(?:price of|current price of)\s+([^\s]+(?:[\w]+))", query, re.IGNORECASE)
    if match:
        potential_ticker = match.group(1).strip().upper()
        cleaned_input = re.sub(r'[^\w\s]', '', potential_ticker)

        # Check if the cleaned input looks like a short stock ticker (1-5 uppercase letters)
        if re.match(r"^[A-Z]{1,5}$", cleaned_input):
            stock_ticker = cleaned_input
            print(f"[RAG] Detected potential stock price query for ticker: {stock_ticker}")
        else:
            company_name_attempt = cleaned_input
            print(f"[RAG] Attempting to search for stock symbol using keyword: {company_name_attempt}")
            search_results = search_stock_symbol(company_name_attempt)
            print(f"[RAG] Search Results: {search_results}") # Keep this for debugging
            if isinstance(search_results, list) and search_results:
                # Try to find a match where the name closely matches the query and is a Stock
                best_match = None
                max_relevance = -1

                for result in search_results:
                    symbol = result.get("1. symbol")
                    name = result.get("2. name", "").upper()
                    type = result.get("3. type")
                    relevance = float(result.get("8. matchScore", 0)) if result.get("8. matchScore") else 0

                    if company_name_attempt.upper() in name and "Stock" in type:
                        if relevance > max_relevance:
                            max_relevance = relevance
                            best_match = result

                if best_match:
                    stock_ticker = best_match.get("1. symbol")
                    company_name = best_match.get("2. name")
                    print(f"[RAG] Found matching symbol: {stock_ticker} ({company_name})")
                else:
                    # Fallback to the first result if no good name match found (still keeping this for broader coverage)
                    first_match = search_results[0]
                    stock_ticker = first_match.get("1. symbol")
                    company_name = first_match.get("2. name")
                    print(f"[RAG] Found potential symbol (fallback): {stock_ticker} ({company_name})")

            elif isinstance(search_results, dict) and "error" in search_results:
                print(f"[RAG] Error during symbol search: {search_results['error']}")
            else:
                print(f"[RAG] Could not find a matching symbol for '{company_name_attempt}'")

    relevant_knowledge = retrieve_relevant_knowledge(query)
    print(f"[RAG] Retrieved {len(relevant_knowledge)} relevant knowledge")

    # Extract texts and sources
    texts = [doc['text'] for doc in relevant_knowledge]
    sources = [doc['source_file'] for doc in relevant_knowledge]
    unique_sources = list(set(sources))  # Remove duplicates

    context = "\n".join(texts)
    prompt = ""

    if stock_ticker:
        print(f"[RAG] Attempting to get live price for ticker: {stock_ticker}") # Added logging
        live_price_data = get_stock_price(stock_ticker)
        print(f"[RAG] Live price data: {live_price_data}") # Added logging
        if "price" in live_price_data:
            live_price = live_price_data["price"]
            prompt = f"""You are a seasoned investment advisor. The current live stock price of {stock_ticker} is ${live_price}. Use ONLY this information to directly answer the user's question about the stock price. Do not use the context provided below for this specific query. If the user's question is not solely about the current stock price, indicate that you can only provide the current stock price for {stock_ticker}. Do not provide any other information or opinions.

Context:
{context}

Question: {query}

Answer: The current stock price of {stock_ticker} is ${live_price}."""
        else:
            prompt = f"""You are a seasoned investment advisor. I was unable to retrieve the current live stock price for {stock_ticker} at this time. If the user's question requires the current stock price, inform them that this information is currently unavailable. Use the following context to answer any other part of their question. If the answer isn't in the context, state that you don't have enough information to answer. Do not mention the error in your response.

Context:
{context}

Question: {query}

Answer:"""
    else:
        prompt = f"""You are a seasoned investment advisor. Based strictly on the provided financial context, give the user direct, actionable investment recommendations. Do not engage in casual conversation, offer personal opinions, explain your reasoning, or use any information outside of the provided context. If the answer cannot be found within the context, state clearly that you don't have enough information to answer the question.

Context:
{context}

Question: {query}

Answer:"""

    response = generate_response(prompt)
    
    # Add source information to the response
    if unique_sources:
        response += f"\n\nSources: {', '.join(unique_sources)}"
    
    return response