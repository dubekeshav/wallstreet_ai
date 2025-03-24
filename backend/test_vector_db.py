from app.core.vector_database.vector_db_service import add_knowledge, get_client, get_collection, retrieve_relevant_knowledge
from app.core.embedding.embedding_service import generate_embeddings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_vector_db_persistence():
    # Declare globals at the start
    from app.core.vector_database.vector_db_service import client, collection
    global client, collection
    
    try:
        # Step 1: Add test document
        test_doc = "This is a test document for verifying ChromaDB persistence across restarts."
        logger.info("[Test] Adding test document...")
        
        embedding = generate_embeddings(test_doc)
        add_knowledge(
            documents=[test_doc],
            embeddings=[embedding],
            ids=["test_doc_1"],
            collection_name="test_collection"
        )
        
        # Step 2: Simulate server restart by resetting the client and collection
        logger.info("[Test] Simulating server restart...")
        client = None
        collection = None
        
        # Step 3: Try to retrieve the document
        logger.info("[Test] Attempting to retrieve the document...")
        results = retrieve_relevant_knowledge(
            query="test document for verifying",
            top_k=1,
            collection_name="test_collection"
        )
        
        if results and test_doc in results:
            logger.info("[Test] Success! Document was retrieved after simulated restart")
            logger.info(f"[Test] Retrieved content: {results}")
        else:
            logger.error("[Test] Failed! Document was not found after restart")
            
    except Exception as e:
        logger.error(f"Error during test: {str(e)}")
        raise

if __name__ == "__main__":
    test_vector_db_persistence() 