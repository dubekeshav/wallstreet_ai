from sentence_transformers import SentenceTransformer
import torch

embedding_model = None

def load_embedding_model(model_name='all-mpnet-base-v2'):
    global embedding_model
    if embedding_model is None:
        # Check if CUDA is available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"[Embedding] Using device: {device}")
        if device == "cuda":
            print(f"[Embedding] GPU Device: {torch.cuda.get_device_name(0)}")
            print(f"[Embedding] GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
        
        embedding_model = SentenceTransformer(model_name)
        embedding_model.to(device)  # Move model to GPU if available
        print(f"[Embedding] Model moved to {device}")
    return embedding_model

def generate_embeddings(text):
    model = load_embedding_model()
    # Use GPU for inference if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[Embedding] Generating embeddings on {device}")
    return model.encode(text, device=device)

def get_embedding_dimension():
    model = load_embedding_model()
    return model.get_sentence_embedding_dimension()

