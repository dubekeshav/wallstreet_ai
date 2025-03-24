import os
import json
from app.core.embedding.embedding_service import generate_embeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from PyPDF2 import PdfReader
import logging
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BOOK_DATA_DIR = os.path.join(SCRIPT_DIR, "book_data")
EMBEDDINGS_FILE = os.path.join(SCRIPT_DIR, "book_embeddings.json")
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

def read_pdf_file(file_path):
    """Read text from a PDF file."""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logger.error(f"Error reading PDF file {file_path}: {str(e)}")
        return None

def read_text_file(file_path):
    """Read text from a text file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading text file {file_path}: {str(e)}")
        return None

def get_file_hash(file_path):
    """Generate a hash of the file content."""
    try:
        with open(file_path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except Exception as e:
        logger.error(f"Error generating hash for {file_path}: {str(e)}")
        return None

def process_book(file_path):
    """Process a single book file and return its embeddings data."""
    try:
        # Get file hash for tracking
        file_hash = get_file_hash(file_path)
        if not file_hash:
            return None

        # Get the file name without extension
        file_name = os.path.splitext(os.path.basename(file_path))[0]

        # Read file content
        if file_path.lower().endswith('.pdf'):
            text = read_pdf_file(file_path)
        else:
            text = read_text_file(file_path)

        if not text:
            return None

        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            length_function=len,
        )
        chunks = text_splitter.split_text(text)
        logger.info(f"Created {len(chunks)} chunks from {file_path}")

        # Generate embeddings
        embeddings = [generate_embeddings(chunk) for chunk in chunks]
        logger.info(f"Generated {len(embeddings)} embeddings for {file_path}")

        # Create embeddings data
        embeddings_data = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            chunk_id = f"{file_name}_{i}"  # Using file name instead of hash
            embeddings_data.append({
                "id": chunk_id,
                "text": chunk,
                "embedding": embedding.tolist() if hasattr(embedding, 'tolist') else embedding,
                "source_file": file_name,
                "file_hash": file_hash
            })

        return embeddings_data

    except Exception as e:
        logger.error(f"Error processing book {file_path}: {str(e)}")
        return None

def main():
    try:
        # Load existing embeddings if file exists
        existing_embeddings = []
        existing_file_hashes = set()
        if os.path.exists(EMBEDDINGS_FILE):
            logger.info(f"Loading existing embeddings from {EMBEDDINGS_FILE}")
            with open(EMBEDDINGS_FILE, 'r') as f:
                existing_embeddings = json.load(f)
                existing_file_hashes = {item['file_hash'] for item in existing_embeddings}
            logger.info(f"Loaded {len(existing_embeddings)} existing embeddings")

        # Process all files in the book_data directory
        all_embeddings_data = existing_embeddings.copy()
        processed_files = 0
        skipped_files = 0

        for filename in os.listdir(BOOK_DATA_DIR):
            file_path = os.path.join(BOOK_DATA_DIR, filename)
            if not os.path.isfile(file_path):
                continue

            # Check if file is already processed
            file_hash = get_file_hash(file_path)
            if file_hash in existing_file_hashes:
                logger.info(f"Skipping already processed file: {filename}")
                skipped_files += 1
                continue

            logger.info(f"Processing new file: {filename}")
            book_data = process_book(file_path)
            if book_data:
                all_embeddings_data.extend(book_data)
                processed_files += 1

        # Save all embeddings
        if processed_files > 0:
            logger.info(f"Saving {len(all_embeddings_data)} total embeddings")
            with open(EMBEDDINGS_FILE, 'w') as f:
                json.dump(all_embeddings_data, f, indent=4)
            logger.info(f"Successfully processed {processed_files} new files")
        else:
            logger.info("No new files to process")

        logger.info(f"Summary: Processed {processed_files} new files, Skipped {skipped_files} existing files")

    except Exception as e:
        logger.error(f"Error in main process: {str(e)}")
        raise

if __name__ == "__main__":
    main()