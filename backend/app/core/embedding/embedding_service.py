from sentence_transformers import SentenceTransformer

embedding_model = None

def load_embedding_model(model_name: str = "all_mpnet_base_v2"):
    global embedding_model
    if embedding_model is None:
        embedding_model = SentenceTransformer(model_name)
    return embedding_model

def generate_embeddings(text:str):
    model = load_embedding_model()
    return model.encode(text)