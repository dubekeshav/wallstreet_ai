from pinecone import Pinecone
from app.config import PINECONE_API_KEY
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clear_pinecone_index():
    try:
        # Initialize Pinecone Client
        client = Pinecone(api_key=PINECONE_API_KEY)
        logger.info("[Pinecone] Initialized PineconeClient")

        # Connect to index
        index = client.Index("investment-knowledge")
        logger.info("[Pinecone] Connected to index")

        # Get current stats
        stats = index.describe_index_stats()
        logger.info(f"[Pinecone] Current vector count: {stats.total_vector_count}")

        # Delete all vectors
        index.delete(delete_all=True)
        logger.info("[Pinecone] Successfully deleted all vectors")

        # Verify deletion
        stats = index.describe_index_stats()
        logger.info(f"[Pinecone] New vector count: {stats.total_vector_count}")

    except Exception as e:
        logger.error(f"[Pinecone] Error clearing index: {str(e)}")
        raise

if __name__ == "__main__":
    clear_pinecone_index() 