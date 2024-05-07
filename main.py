# main.py
import webbrowser
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, validator
from typing import List, Dict
from pymongo import MongoClient
from abc import abstractmethod
from fastapi.param_functions import Depends

app = FastAPI()
users = []
CONN_STR = "mongodb+srv://dianasakeer:1234@cluster-1.xgxy3zr.mongodb.net/"
DB_NAME = 'Whoofi'
DOG_OWNER = 'dog_owner'
DOG_WALKER = 'dog_walker'


def get_collction_from_db(collection_name):
    # Create a new client and connect to the server
    cluster = MongoClient(CONN_STR)
    db = cluster[DB_NAME]
    return db[collection_name], cluster


class User(BaseModel):
    id: int
    username: str
    email: str
    city: str
    region: str

    class Config:
        from_attributes = True

    # @classmethod
    # def __init__(cls, **values):
    #     super().__init__(**values)

    @validator("email")
    def email_must_contain_at(cls, v):
        if "@" not in v:
            raise ValueError("must contain a valid email address")
        return v

    @abstractmethod
    def save_user(self):
        return {'_id': self.id, 'username': self.username, 'email': self.email,
                'city': self.city, 'region': self.region}


class DogOwner(User):
    dogs: List[str]
    dog_name: str
    dog_birth_date: str
    dog_type: str

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    @validator("dog_name")
    def dog_name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("dog name cannot be empty")
        return v

    def save_user(self):
        data = super(DogOwner, self).save_user()
        data.update({'dogs': self.dogs, 'dog_name': self.dog_name, 'dog_birth_date': self.dog_birth_date,
                     'dog_type': self.dog_type})
        collection, cluster = get_collction_from_db(DOG_OWNER)
        collection.insert_one(data)
        cluster.close()


class DogWalker(User):
    services: List[str]
    hourly_rate: float
    name: str
    age: int
    years_of_experience: float

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    @validator("hourly_rate")
    def rate_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("hourly rate must be positive")
        return v

    def save_user(self):
        data = super(DogWalker, self).save_user()
        data.update({'services': self.services, 'hourly_rate': self.hourly_rate, 'name': self.name,
                     'age': self.age, 'years_of_experience': self.years_of_experience})
        collection, cluster = get_collction_from_db(DOG_WALKER)
        collection.insert_one(data)
        cluster.close()


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Whoofi API"}


class CustomForm(BaseModel):
    user_type: str
    user_data: Dict


@app.post("/create_user/")
async def create_user(form_data: CustomForm = Depends()):
    user_type = form_data.user_type
    user_data = form_data.user_data
    if user_type.lower() == 'dogowner':
        user = DogOwner(**user_data)
    elif user_type.lower() == 'dogwalker':
        user = DogWalker(**user_data)
    else:
        raise HTTPException(status_code=400, detail="Invalid user type. Please specify 'dogowner' or 'dogwalker'.")

    users.append(user)
    return {"message": f"Hello {user.username}, your data is: {user.dict()}"}


import threading
import webbrowser

def open_browser():
    webbrowser.open("http://localhost:8000")

if __name__ == "__main__":
    threading.Thread(target=open_browser).start()
    uvicorn.run("main:app", host="localhost", port=8000, reload=True, log_level="info")
