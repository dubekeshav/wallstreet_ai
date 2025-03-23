import matplotlib.pyplot as plt
import io
import base64

'''
TODO:
- Need to add mroe functions for different types of charts.
'''

def generate_line_chart(data: list[float], title: str = "Stock Price trend", x_label: str = "Time", y_label: str = "Price"):
    plt.figure(figsize=(10,6))
    plt.title(title)
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.plot(data, linestyle='-', color='b')
    plt.grid(True)
    
    # Save the plot to a BytesIO object
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    
    # Encode the image to base64 for embedding in HTML/JSON
    image_base64 = base64.b64encode(buffer.read()).decode("utf-8")
    plt.close()
    return f"data: image/png;base64,{image_base64}"
