import chromadb
from app.core.embedding.embedding_service import generate_embeddings

client = None
collection = None

def get_client():
    global client
    if client is None:
        client = chromadb.Client()
    return client

def get_collection(collection_name: str = "investment_knowledge"):
    global collection
    client = get_client()
    if collection is None:
        collection = client.get_or_create_collection(collection_name)
    return collection

def add_knowledge(documents: list[str], embeddings: list[list[float]], ids: list[str], collection_name: str = "investment_knowledge"):
    collection = get_collection(collection_name)
    collection.add(
        documents = documents,
        embeddings = embeddings,
        ids = ids
    )

def retrieve_knowledge(query: str, top_k: int = 5, collection_name: str = "investment_knowledge"):
    collection = get_collection(collection_name)
    query_embedding = generate_embeddings(query)
    results = collection.query(
        query_embeddings = [query_embedding],
        n_results = top_k
    )
    return results["documents"][0] if results and results["documents"] else None