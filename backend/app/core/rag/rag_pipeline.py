from app.core.embedding.embedding_service import generate_embeddings
from app.core.llm.llm_service import generate_response
from app.core.vector_database.vector_db_service import retrieve_relevant_knowledge

def rag_pipeline(query: str):
    relevant_knowledge = retrieve_relevant_knowledge(query)
    if relevant_knowledge is not None:
        context = "\n".join(relevant_knowledge)
        prompt = f"""
        You are an expert investment advisor. Use the following context to answer the user's question. If you don't have information, just say "I don't really know about that topic"
        
        Context: {context}
        Question: {query}
        Answer:
        """
        response = generate_response(prompt)
        return response
    else:
        return "I don't really know about that topic"
    