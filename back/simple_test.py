from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import webbrowser
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173"
]

# Add CORS middleware to your FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class UserData(BaseModel):
    id: int
    username: str
    email: str
    city: str
    region: str
    user_type: str
    dog_name: str
    dog_birth_date: str
    dog_type: str
    dogs: list[str]

@app.post("/create_user")
async def create_new_user(user_data: UserData):
    print("Received new user data:")
    print(user_data)
    return {"message": "User data received successfully"}


if __name__ == "__main__":
    uvicorn.run("simple_test:app", host="localhost", port=8000, reload=True, log_level="info")
    webbrowser.open("http://localhost:8000")