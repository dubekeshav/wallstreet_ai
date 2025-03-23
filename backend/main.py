from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat, data

app = FastAPI()

# CORS settings
origins = [
    "*" # To allow all origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = {"*"}
)

# Include API routers
app.include_router(chat.router)
app.include_router(data.router)

@app.get("/")
async def root():
    return {
        "message": "Wallstreet AI backend is running"
    }
    
if __name__=="__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port = 8080)