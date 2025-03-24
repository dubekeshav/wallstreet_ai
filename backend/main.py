from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat, data

app = FastAPI()

# CORS settings (adjust as needed for your frontend's origin)
origins = [
    "http://localhost:3000",  # Default Next.js dev server
    "http://localhost:8000",  # Example for other ports
    "*",  # Be cautious with this in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(chat.router, prefix="/chat")
app.include_router(data.router)

@app.get("/")
async def root():
    return {"message": "WallStreet AI Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)