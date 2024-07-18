# main.py
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user_routes import user_router
from routes.dog_routes import dog_router
from routes.walker_routes import walker_router
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

app = FastAPI()


# Add CORS middleware to your FastAPI application
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

app.include_router(user_router)
app.include_router(dog_router)
app.include_router(walker_router)


@app.get("/")
async def read_root():
    return "Welcome to the Whoofi API"

if __name__ == "__main__":
    host = os.getenv("HOST", "10.0.0.3")
    port = int(os.getenv("PORT", 4172))
    uvicorn.run("main:app", host=host, port=port, reload=True, log_level="info")
