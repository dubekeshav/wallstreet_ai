
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="WallStreet AI Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    content: str
    role: str


class ChatRequest(BaseModel):
    messages: List[Message]
    query: str


class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[dict]] = None


@app.get("/")
def read_root():
    return {"message": "Welcome to WallStreet AI API"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # This is a placeholder for the actual AI processing
        # In a real implementation, this would connect to your RAG pipeline
        
        return {
            "response": f"This is a mock response to: {request.query}. In a real implementation, this would be processed by the RAG pipeline.",
            "sources": [
                {"title": "Sample Source 1", "url": "https://example.com/1"},
                {"title": "Sample Source 2", "url": "https://example.com/2"}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
