
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Optional
import uuid
import shelve
import os
from pydantic import BaseModel
from app.core.rag.rag_pipeline import rag_pipeline
import logging
import time
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])

# Request models
class ChatMessage(BaseModel):
    session_id: str
    query: str

class PinChatRequest(BaseModel):
    session_id: str
    pinned: bool

class TagChatRequest(BaseModel):
    session_id: str
    tag_name: str
    tag_color: str

# Ensure data directory exists
data_dir = Path("backend/data")
data_dir.mkdir(exist_ok=True)

# Path to shelve database
SHELVE_PATH = str(data_dir / "chat_data")

def get_chat_db():
    """Get a connection to the shelve database"""
    return shelve.open(SHELVE_PATH, writeback=True)

@router.post("/new")
async def new_chat():
    session_id = str(uuid.uuid4())
    logger.info(f"[Chat] Creating new chat session: {session_id}")
    
    with get_chat_db() as db:
        db[session_id] = {
            "messages": [],
            "pinned": False,
            "tag": None,
            "timestamp": time.time(),
            "preview": "New conversation"
        }
    
    return {"session_id": session_id, "message": "New chat started"}

@router.post("/send")
async def send_message(message: ChatMessage):
    logger.info(f"[Chat] Received message for session {message.session_id}")
    logger.debug(f"[Chat] Query: {message.query[:100]}...")
    
    with get_chat_db() as db:
        if message.session_id not in db:
            logger.error(f"[Chat] Session not found: {message.session_id}")
            raise HTTPException(status_code=404, detail="Session not found")
        
        chat_data = db[message.session_id]
        messages = chat_data.get("messages", [])
    
    try:
        # Add user message to chat history
        new_message = {"role": "user", "content": message.query, "timestamp": time.time()}
        messages.append(new_message)
        
        # Generate RAG response
        logger.info("[Chat] Starting RAG pipeline")
        response = rag_pipeline(message.query)
        logger.info("[Chat] RAG pipeline completed successfully")
        
        # Split response into content and sources if present
        response_parts = response.split("\n\nSources:")
        content = response_parts[0]
        sources = response_parts[1] if len(response_parts) > 1 else None
        
        # Remove the think section if present
        if "<think>" in content and "</think>" in content:
            content = content.split("</think>")[1].strip()
        
        # Clean up the response format
        # Remove "Answer:" prefixes and clean up line breaks
        content = content.replace("Answer:", "").strip()
        
        # Clean up markdown formatting
        # Remove extra asterisks from headers
        content = content.replace("**Explanation", "#")
        content = content.replace("**", "")
        
        # Clean up multiple line spaces and preserve paragraph structure
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        content = "\n\n".join(paragraphs)
        
        # Ensure proper markdown list formatting
        content = content.replace("\n- ", "\n\n- ")
        
        # Store both content and sources in chat history
        bot_message = {
            "role": "bot",
            "content": content,
            "sources": sources,
            "timestamp": time.time()
        }
        messages.append(bot_message)
        
        # Update preview text for this chat
        preview = message.query[:30] + "..." if len(message.query) > 30 else message.query
        
        # Save updates to the database
        with get_chat_db() as db:
            chat_data = db[message.session_id]
            chat_data["messages"] = messages
            chat_data["preview"] = preview
            chat_data["timestamp"] = time.time()
            db[message.session_id] = chat_data
        
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
    
    with get_chat_db() as db:
        if session_id not in db:
            logger.error(f"[Chat] Session not found: {session_id}")
            raise HTTPException(status_code=404, detail="Session not found")
        
        chat_data = db[session_id]
        messages = chat_data.get("messages", [])
    
    logger.info(f"[Chat] Found {len(messages)} messages in history")
    return messages

@router.get("/chats")
async def get_all_chats():
    """Get all chat sessions with metadata"""
    logger.info("[Chat] Retrieving all chat sessions")
    
    chat_list = []
    with get_chat_db() as db:
        for session_id in db.keys():
            chat_data = db[session_id]
            chat_list.append({
                "id": session_id,
                "preview": chat_data.get("preview", "Chat"),
                "timestamp": chat_data.get("timestamp", 0),
                "pinned": chat_data.get("pinned", False),
                "tag": chat_data.get("tag", None)
            })
    
    # Sort by pinned status first, then by timestamp
    chat_list.sort(key=lambda x: (-int(x["pinned"]), -x["timestamp"]))
    
    logger.info(f"[Chat] Found {len(chat_list)} chat sessions")
    return chat_list

@router.post("/pin")
async def pin_chat(pin_request: PinChatRequest):
    """Pin or unpin a chat"""
    logger.info(f"[Chat] Updating pin status for session {pin_request.session_id}")
    
    with get_chat_db() as db:
        if pin_request.session_id not in db:
            logger.error(f"[Chat] Session not found: {pin_request.session_id}")
            raise HTTPException(status_code=404, detail="Session not found")
        
        chat_data = db[pin_request.session_id]
        chat_data["pinned"] = pin_request.pinned
        db[pin_request.session_id] = chat_data
    
    return {"message": "Chat pin status updated", "pinned": pin_request.pinned}

@router.post("/tag")
async def tag_chat(tag_request: TagChatRequest):
    """Add a tag to a chat"""
    logger.info(f"[Chat] Adding tag to session {tag_request.session_id}")
    
    with get_chat_db() as db:
        if tag_request.session_id not in db:
            logger.error(f"[Chat] Session not found: {tag_request.session_id}")
            raise HTTPException(status_code=404, detail="Session not found")
        
        chat_data = db[tag_request.session_id]
        chat_data["tag"] = {
            "name": tag_request.tag_name,
            "color": tag_request.tag_color
        }
        db[tag_request.session_id] = chat_data
    
    return {
        "message": "Chat tagged successfully", 
        "tag": {
            "name": tag_request.tag_name,
            "color": tag_request.tag_color
        }
    }

@router.delete("/delete/{session_id}")
async def delete_chat(session_id: str):
    """Delete a chat session"""
    logger.info(f"[Chat] Deleting session {session_id}")
    
    with get_chat_db() as db:
        if session_id not in db:
            logger.error(f"[Chat] Session not found: {session_id}")
            raise HTTPException(status_code=404, detail="Session not found")
        
        del db[session_id]
    
    return {"message": "Chat deleted successfully"}
