# main.py
import webbrowser
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user_routes import user_router
from routes.dog_routes import dog_router
from routes.walker_routes import walker_router

app = FastAPI()

origins = ["http://localhost", "http://localhost:5173"]

# Add CORS middleware to your FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(dog_router)
app.include_router(walker_router)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Whoofi API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True, log_level="info")
    webbrowser.open("http://localhost:8000")
