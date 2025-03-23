
import logging
import matplotlib.pyplot as plt
import pandas as pd
import io
import base64
from typing import List, Dict, Any, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def sanitize_input(text: str) -> str:
    """Sanitize user input to prevent injection attacks."""
    # Basic sanitization - in a real app, use a proper library
    return text.strip()

def generate_stock_chart(data: List[Dict[str, Any]], title: str = "Stock Price") -> str:
    """
    Generate a chart image from stock data and return as base64 encoded string.
    
    Args:
        data: List of dictionaries with date and price information
        title: Chart title
        
    Returns:
        Base64 encoded string of the chart image
    """
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Create the chart
        plt.figure(figsize=(10, 6))
        plt.plot(df['date'], df['price'])
        plt.title(title)
        plt.xlabel('Date')
        plt.ylabel('Price ($)')
        plt.grid(True, alpha=0.3)
        
        # Convert plot to base64 string
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()
        
        return f"data:image/png;base64,{image_base64}"
    except Exception as e:
        logger.error(f"Error generating chart: {str(e)}")
        return ""

def format_currency(value: Union[float, int]) -> str:
    """Format a number as USD currency."""
    return f"${value:,.2f}"

def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """Calculate percentage change between two values."""
    if old_value == 0:
        return 0
    return ((new_value - old_value) / abs(old_value)) * 100
