import json
from pinecone import Pinecone
from app.config import PINECONE_API_KEY
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Configuration ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
EMBEDDINGS_FILE = os.path.join(SCRIPT_DIR, "book_embeddings.json")
PINECONE_INDEX_NAME = "investment-knowledge"
BATCH_SIZE = 100

def upload_embeddings_to_pinecone():
    try:
        # Initialize Pinecone Client
        client = Pinecone(api_key=PINECONE_API_KEY)
        logger.info("[Pinecone] Initialized PineconeClient")

        # Connect to index
        index = client.Index(PINECONE_INDEX_NAME)
        logger.info(f"[Pinecone] Connected to index: {PINECONE_INDEX_NAME}")

        # Load embeddings from file
        with open(EMBEDDINGS_FILE, 'r') as f:
            embeddings_data = json.load(f)
            logger.info(f"[Pinecone] Loaded {len(embeddings_data)} embeddings from file")

        vectors_to_upsert = []
        total_upserted = 0
        
        for item in embeddings_data:
            vector = {
                'id': item['id'],
                'values': item['embedding'],
                'metadata': {
                    'text': item['text'],
                    'source_file': item.get('source_file', 'unknown'),
                    'file_hash': item.get('file_hash', 'unknown')
                }
            }
            vectors_to_upsert.append(vector)

            if len(vectors_to_upsert) >= BATCH_SIZE:
                index.upsert(vectors=vectors_to_upsert)
                total_upserted += len(vectors_to_upsert)
                vectors_to_upsert = []
                logger.info(f"[Pinecone] Upserted {total_upserted} vectors")

        # Upsert remaining vectors
        if vectors_to_upsert:
            index.upsert(vectors=vectors_to_upsert)
            total_upserted += len(vectors_to_upsert)
            logger.info(f"[Pinecone] Upserted {len(vectors_to_upsert)} remaining vectors")

        logger.info(f"[Pinecone] Successfully uploaded all {total_upserted} embeddings")

    except Exception as e:
        logger.error(f"[Pinecone] Error uploading embeddings: {str(e)}")
        raise

if __name__ == "__main__":
    upload_embeddings_to_pinecone()
