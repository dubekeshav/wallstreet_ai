import os
import json
from app.core.embedding.embedding_service import generate_embeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_embedding():
    try:
        # Test text
        test_text = """
        This is a test document for verifying the embedding generation process.
        It contains multiple sentences to test the chunking functionality.
        The text will be split into chunks and each chunk will be embedded.
        This helps us verify that the entire pipeline works correctly.
        """
        
        logger.info("[Test] Starting embedding test")
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            length_function=len,
        )
        chunks = text_splitter.split_text(test_text)
        logger.info(f"[Test] Created {len(chunks)} chunks")
        
        # Generate embeddings
        embeddings = [generate_embeddings(chunk) for chunk in chunks]
        logger.info(f"[Test] Generated {len(embeddings)} embeddings")
        
        # Create test data
        test_data = [{
            "id": f"test_chunk_{i}",
            "text": chunk,
            "embedding": embedding.tolist() if hasattr(embedding, 'tolist') else embedding
        } for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))]
        
        # Save to file in the backend directory
        output_file = os.path.join(os.path.dirname(__file__), "test_embeddings.json")
        logger.info(f"[Test] Saving to: {output_file}")
        
        with open(output_file, 'w') as f:
            json.dump(test_data, f, indent=4)
            
        logger.info(f"[Test] Successfully saved test embeddings to {output_file}")
        logger.info(f"[Test] Number of chunks: {len(chunks)}")
        logger.info(f"[Test] Embedding dimension: {len(embeddings[0])}")
        
    except Exception as e:
        logger.error(f"[Test] Error during test: {str(e)}")
        raise

if __name__ == "__main__":
    test_embedding() 