from fastapi import APIRouter, HTTPException
from typing import List, Dict
import uuid
from pydantic import BaseModel
from app.core.rag.rag_pipeline import rag_pipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])

# Request models
class ChatMessage(BaseModel):
    session_id: str
    query: str

chat_history: Dict[str, List[Dict]] = {}

@router.post("/new")
async def new_chat():
    session_id = str(uuid.uuid4())
    logger.info(f"[Chat] Creating new chat session: {session_id}")
    chat_history[session_id] = []
    return {"session_id": session_id, "message": "New chat started"}

@router.post("/send")
async def send_message(message: ChatMessage):
    logger.info(f"[Chat] Received message for session {message.session_id}")
    logger.debug(f"[Chat] Query: {message.query[:100]}...")
    
    if message.session_id not in chat_history:
        logger.error(f"[Chat] Session not found: {message.session_id}")
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        chat_history[message.session_id].append({"role": "user", "content": message.query})
        logger.info("[Chat] Starting RAG pipeline")
        response = rag_pipeline(message.query)
        logger.info("[Chat] RAG pipeline completed successfully")
        
        # Split response into content and sources if present
        response_parts = response.split("\n\nSources:")
        content = response_parts[0]
        sources = response_parts[1] if len(response_parts) > 1 else None
        
        # Store both content and sources in chat history
        chat_history[message.session_id].append({
            "role": "bot",
            "content": content,
            "sources": sources
        })
        
        logger.info(f"[Chat] Response length: {len(content)} characters")
        return {
            "response": content,
            "sources": sources
        }
    except Exception as e:
        logger.error(f"[Chat] Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    logger.info(f"[Chat] Retrieving history for session: {session_id}")
    if session_id not in chat_history:
        logger.error(f"[Chat] Session not found: {session_id}")
        raise HTTPException(status_code=404, detail="Session not found")
    
    history = chat_history[session_id]
    logger.info(f"[Chat] Found {len(history)} messages in history")
    return history