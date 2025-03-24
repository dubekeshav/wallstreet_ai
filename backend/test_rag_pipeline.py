import logging
from app.core.rag.rag_pipeline import rag_pipeline
from app.core.vector_database.vector_db_service import retrieve_relevant_knowledge
from app.core.llm.llm_service import generate_response

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_rag_pipeline():
    # Test cases
    test_queries = [
        "What are the key principles of value investing?",
        "What is the current price of AAPL?",
        "Tell me about Warren Buffett's investment strategy",
        "What are the risks of day trading?"
    ]
    
    logger.info("Starting RAG Pipeline Tests")
    logger.info("=" * 50)
    
    for query in test_queries:
        logger.info(f"\nTesting query: {query}")
        logger.info("-" * 30)
        
        try:
            # Test vector database retrieval
            logger.info("Testing vector database retrieval...")
            relevant_docs = retrieve_relevant_knowledge(query)
            logger.info(f"Retrieved {len(relevant_docs)} relevant documents")
            if relevant_docs:
                logger.info("Sample document sources:")
                for doc in relevant_docs[:2]:
                    logger.info(f"- {doc['source_file']}")
            
            # Test full RAG pipeline
            logger.info("\nTesting full RAG pipeline...")
            response = rag_pipeline(query)
            
            # Split response into content and sources
            response_parts = response.split("\n\nSources:")
            content = response_parts[0]
            sources = response_parts[1] if len(response_parts) > 1 else None
            
            logger.info("\nResponse content preview:")
            logger.info(content[:200] + "...")
            
            if sources:
                logger.info("\nSources:")
                logger.info(sources)
            else:
                logger.info("\nNo sources found in response")
            
            logger.info("-" * 30)
            
        except Exception as e:
            logger.error(f"Error testing query '{query}': {str(e)}")
            continue

if __name__ == "__main__":
    test_rag_pipeline() 