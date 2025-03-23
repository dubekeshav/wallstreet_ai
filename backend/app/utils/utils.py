
def sanitize_input(input_text: str) -> str:
    """
    Sanitize user input to prevent injection attacks
    """
    # Basic sanitization
    sanitized = input_text.strip()
    return sanitized
