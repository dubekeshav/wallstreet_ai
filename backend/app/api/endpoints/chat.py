from fastapi import APIRouter, HTTPException
from typing import List, Dict

'''
TODO:
- Implement proper session ID generation
'''

router = APIRouter()

# Placeholder for chat history management
chat_history: Dict[str, List[Dict]] = {}

@router.post("/new")
async def new_chat():
    session_id = "unique_session_id"
    chat_history[session_id] = []
    return {"session_id": session_id, "message": "New chat started"}

@router.post("/send")
async def send_message(session_id: str, query: str):
    if session_id not in chat_history:
        raise HTTPException(status_code=404, detail = "Session not found")
    chat_history[session_id].append({"role": "user", "content": query})
    response = rag_pipeline(query) # Or the orchestrated function call
    chat_history[session_id].append({"role": "bot", "response": response})
    return {"response": response}

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    if session_id not in chat_history:
        raise HTTPException(status_code = 404, details = "Session not found")
    return chat_history[session_id]
