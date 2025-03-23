from transformers import pipeline

llm_pipeline = None
default_model_name = "deepseek-ai/deepseek-llm-7b-chat"

def load_llm_pipeline(model_name: str = default_model_name):
    global llm_pipeline
    if llm_pipeline is None:
        llm_pipeline = pipeline("text-generation")
    return llm_pipeline

def generate_response(prompt: str, max_length:int = 150):
    pipeline = load_llm_pipeline()
    # eos_token_id=2: Added an eos_token_id which is often used with DeepSeek models to signal the end of the generated text
    response = pipeline(prompt, max_length, num_return_sequences=1, eos_token_id=2)[0]['generated_text']
    return response

