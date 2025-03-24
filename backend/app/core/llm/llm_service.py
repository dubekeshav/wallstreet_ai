import os
from groq import Groq
from app.config import GROQ_API_KEY
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = None

def get_groq_client():
    global client
    if client is None:
        logger.info("[LLM] Initializing new Groq client")
        client = Groq(api_key=GROQ_API_KEY)
    return client

def generate_response(prompt, max_tokens=1000):
    logger.info("[LLM] Starting response generation")
    logger.debug(f"[LLM] Prompt length: {len(prompt)} characters")
    
    client = get_groq_client()
    try:
        logger.info("[LLM] Sending request to Groq API")
        completion = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )
        response = completion.choices[0].message.content
        logger.info(f"[LLM] Successfully generated response of length: {len(response)}")
        logger.debug(f"[LLM] Response preview: {response[:100]}...")
        return response
    except Exception as e:
        logger.error(f"[LLM] Error generating response: {str(e)}")
        raise