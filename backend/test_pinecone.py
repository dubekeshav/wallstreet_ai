from pinecone import Pinecone

from app.config import PINECONE_API_KEY


pc = Pinecone(api_key=PINECONE_API_KEY)

index = pc.Index("investment-knowledge")


