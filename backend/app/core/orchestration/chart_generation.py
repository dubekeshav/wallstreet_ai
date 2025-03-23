
from typing import Optional
import base64
import io
import matplotlib.pyplot as plt
import numpy as np

def generate_chart_if_needed(query: str, response: str) -> Optional[str]:
    """
    Generate a chart image if the query warrants visual data
    
    Args:
        query: The user's query
        response: The response text
        
    Returns:
        Optional[str]: Base64 encoded chart image or None
    """
    # Check if the query is asking for visual data
    chart_keywords = [
        "chart", "graph", "plot", "visualization", "trend", 
        "compare", "performance", "historical", "growth"
    ]
    
    if not any(keyword in query.lower() for keyword in chart_keywords):
        return None
    
    # Generate a mock chart for demonstration
    plt.figure(figsize=(10, 6))
    
    # Sample data for demonstration
    categories = ['S&P 500', 'NASDAQ', 'DOW', 'RUSSELL 2000']
    performance = [12.5, 15.2, 8.7, 9.3]
    
    # Create bar chart
    plt.bar(categories, performance, color='#f59e0b')
    plt.title('Market Performance (YTD)')
    plt.ylabel('% Return')
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    # Save to bytes buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    
    # Convert to base64 for frontend display
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close()
    
    return f"data:image/png;base64,{image_base64}"
