from pinecone import Pinecone
from app.core.embedding.embedding_service import generate_embeddings
from app.config import PINECONE_API_KEY
import logging
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Pinecone client
client = None
index = None

def get_client():
    global client
    if client is None:
        logger.info("[VectorDB] Initializing new Pinecone client")
        client = Pinecone(api_key=PINECONE_API_KEY)
    return client

def get_index(index_name="investment-knowledge"):
    global index
    if index is None:
        logger.info(f"[VectorDB] Getting or creating index: {index_name}")
        client = get_client()
        index = client.Index(index_name)
        # Log index stats
        stats = index.describe_index_stats()
        logger.info(f"[VectorDB] Index '{index_name}' contains {stats.total_vector_count} vectors")
    return index

def add_knowledge(documents, embeddings, ids, index_name="investment-knowledge"):
    logger.info(f"[VectorDB] Starting to add {len(documents)} documents to index: {index_name}")
    index = get_index(index_name)
    
    # Log embedding dimensions
    if embeddings:
        logger.info(f"[VectorDB] Embedding dimension: {len(embeddings[0])}")
        logger.debug(f"[VectorDB] Sample embedding shape: {np.array(embeddings[0]).shape}")
    
    # Prepare vectors for Pinecone
    vectors = []
    for doc, embedding, id in zip(documents, embeddings, ids):
        # Extract source file from id (format: file_hash_chunk_number)
        source_file = id.split('_')[0] if '_' in id else 'unknown'
        
        vector = {
            'id': id,
            'values': embedding.tolist() if hasattr(embedding, 'tolist') else embedding,
            'metadata': {
                'text': doc,
                'source_file': source_file,
                'file_hash': source_file  # Using source_file as file_hash for now
            }
        }
        vectors.append(vector)
    
    # Upsert vectors in batches of 100
    batch_size = 100
    total_upserted = 0
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        try:
            index.upsert(vectors=batch)
            total_upserted += len(batch)
            logger.info(f"[VectorDB] Successfully upserted batch of {len(batch)} vectors. Total: {total_upserted}")
        except Exception as e:
            logger.error(f"[VectorDB] Error upserting batch: {str(e)}")
            raise
    
    logger.info(f"[VectorDB] Successfully added all {total_upserted} documents to index")

def retrieve_relevant_knowledge(query, top_k=3, index_name="investment-knowledge"):
    logger.info(f"[VectorDB] Starting retrieval for query: {query[:50]}...")
    index = get_index(index_name)
    
    # Check if index is empty
    stats = index.describe_index_stats()
    if stats.total_vector_count == 0:
        logger.warning("[VectorDB] Index is empty!")
        return []
    
    try:
        query_embedding = generate_embeddings(query)
        logger.info(f"[VectorDB] Generated query embedding with dimension: {len(query_embedding)}")
        
        results = index.query(
            vector=query_embedding.tolist() if hasattr(query_embedding, 'tolist') else query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        
        if not results or not results.matches:
            logger.warning("[VectorDB] No results found!")
            return []
        
        # Extract text and source information from metadata
        documents = []
        for match in results.matches:
            doc = {
                'text': match.metadata['text'],
                'source_file': match.metadata.get('source_file', 'unknown'),
                'file_hash': match.metadata.get('file_hash', 'unknown')
            }
            documents.append(doc)
            
        logger.info(f"[VectorDB] Retrieved {len(documents)} relevant documents")
        logger.debug(f"[VectorDB] First document preview: {documents[0]['text'][:100]}...")
        return documents
    except Exception as e:
        logger.error(f"[VectorDB] Error during retrieval: {str(e)}")
        raise