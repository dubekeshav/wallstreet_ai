
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
from ...core.rag.rag_pipeline import process_query
from ...core.orchestration.chart_generation import generate_chart_if_needed
from ...utils.utils import sanitize_input

router = APIRouter()
logger = logging.getLogger(__name__)

class Message(BaseModel):
    content: str
    role: str


class ChatRequest(BaseModel):
    messages: List[Message]
    query: str


class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[Dict[str, Any]]] = None
    chart: Optional[str] = None


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    try:
        # Sanitize input
        sanitized_query = sanitize_input(request.query)
        
        # Process the query using RAG pipeline
        response, sources = process_query(sanitized_query, request.messages)
        
        # Check if we need to generate a chart
        chart_data = generate_chart_if_needed(sanitized_query, response)
        
        return {
            "response": response,
            "sources": sources,
            "chart": chart_data
        }
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_chat_history():
    """
    Endpoint to retrieve chat history for the current user.
    In a real implementation, this would be connected to a database
    and would use authentication to retrieve the correct history.
    """
    # Mock chat history data
    mock_history = [
        {
            "id": "1",
            "title": "What are the best performing tech stocks?",
            "created_at": "2023-07-12T10:00:00Z",
            "updated_at": "2023-07-12T10:01:00Z",
            "tags": ["stocks"]
        },
        {
            "id": "2",
            "title": "How should I diversify my portfolio?",
            "created_at": "2023-07-11T14:30:00Z",
            "updated_at": "2023-07-11T14:32:00Z",
            "tags": ["investing"]
        }
    ]
    
    return mock_history
