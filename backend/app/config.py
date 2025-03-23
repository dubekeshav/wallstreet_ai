
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API configuration
API_PREFIX = "/api"
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
PROJECT_NAME = "WallStreet AI"

# LLM configuration
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")

# Vector database configuration
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./vectordb")

# Embedding model configuration
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

# External API keys (example for financial data)
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
FINANCIAL_MODELING_PREP_API_KEY = os.getenv("FINANCIAL_MODELING_PREP_API_KEY", "")

# CORS configuration
CORS_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://wallstreetai.com",
    "*",  # For development only, remove in production
]
