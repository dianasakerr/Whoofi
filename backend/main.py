# main.py
import re
import webbrowser
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Optional
from pymongo import MongoClient
from abc import abstractmethod
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
users = []
CONN_STR = "mongodb+srv://dianasakeer:1234@cluster-1.xgxy3zr.mongodb.net/"
DB_NAME = 'Whoofi'
DOG_OWNER = 'dog_owner'
DOG_WALKER = 'dog_walker'
DOG = 'dog'

origins = ["http://localhost", "http://localhost:5173"]


# Add CORS middleware to your FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


def get_collection_from_db(collection_name):
    # Create a new client and connect to the server
    cluster = MongoClient(CONN_STR)
    db = cluster[DB_NAME]
    return db[collection_name], cluster


class User(BaseModel):
    id: str
    username: str
    email: str
    coordinates: list[float]
    phone_number: int

    class Config:
        from_attributes = True

    @abstractmethod
    def save_user(self):
        return {'_id': self.id, 'username': self.username, 'email': self.email, 'coordinates': self.coordinates,
                'phone_number': self.phone_number}


class Dog(BaseModel):
    name: str
    age: float
    race: str
    owner_id: int
    weight: float  # in kg
    size: Optional[str] = None

    def __init__(self, **values):
        super(Dog, self).__init__(**values)
        self.size = self.get_size()
        self.save_user()

    def get_size(self):
        if self.weight <= 10:
            return 'small'
        if self.weight <= 25:
            return 'medium'
        return 'big'

    def save_user(self):
        # check if owner_id exists in dog_owner collection
        dog_owner_collection, cluster = get_collection_from_db(DOG_OWNER)
        owner_exists = dog_owner_collection.find_one({"_id": self.owner_id}) is not None
        cluster.close()

        if not owner_exists:
            raise ValueError(f"Owner with ID {self.owner_id} does not exist.")

        data = {'name': self.name, 'age': self.age, 'race': self.race, 'owner_id': self.owner_id, 'weight': self.weight,
                'size': self.size}
        collection, cluster = get_collection_from_db(DOG)
        collection.insert_one(data)
        cluster.close()

        # update dog owner dogs list
        collection, cluster = get_collection_from_db(DOG_OWNER)
        # TODO: check if to save unique names of the dogs owner or to save dog in dogs list by id
        collection.update_one(filter={'_id': self.owner_id}, update={'$push': {'dogs': [self.name]}})
        cluster.close()


class DogOwner(User):
    dogs: list  # updated automatically when creating dog

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    def save_user(self):
        data = super(DogOwner, self).save_user()
        data['dogs'] = self.dogs
        collection, cluster = get_collection_from_db(DOG_OWNER)
        collection.insert_one(data)
        cluster.close()


class DogWalker(User):
    age: float
    years_of_experience: float
    hourly_rate: float

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    def save_user(self):
        data = super(DogWalker, self).save_user()
        data.update(
            {'hourly_rate': self.hourly_rate, 'age': str(self.age), 'years_of_experience': self.years_of_experience})
        collection, cluster = get_collection_from_db(DOG_WALKER)
        collection.insert_one(data)
        cluster.close()


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Whoofi API"}


class UserCustomForm(BaseModel):
    user_type: str
    user_data: Dict


@app.post("/create_user/")
async def create_user(form_data: UserCustomForm):
    user_type = form_data.user_type.lower()
    user_data = form_data.user_data
    if user_type == 'owner':
        user = DogOwner(**user_data)
    elif user_type == 'walker':
        user = DogWalker(**user_data)
    else:
        raise HTTPException(status_code=400, detail="Invalid user type. Please specify 'owner' or 'walker'.")

    users.append(user)
    return {"message": f"Hello {user.username}, your data is: {user.dict()}"}


class DogCustomForm(BaseModel):
    user_data: Dict


@app.post("/create_dog/")
async def create_dog(form_data: DogCustomForm):
    dog_data = form_data.user_data
    dog = Dog(**dog_data)
    # TODO: add the dog to user dogs list
    return {"message": f"Hello {dog.name}, your data is: {dog_data}"}


@app.get("/get_dog_walkers/")
async def get_dog_walkers(name: str = None, location: str = None, min_experience: float = None):
    key, value = None, None
    if name:
        key = 'name'
        # if the string is partially match regardless of case then it will return it means not full match only
        pattern = re.compile(name, re.IGNORECASE)
        value = {"$regex": pattern}
    elif location:
        key = 'address'
        # if the string is partially match regardless of case then it will return it means not full match only
        pattern = re.compile(location, re.IGNORECASE)
        value = {"$regex": pattern}
    elif min_experience:
        key = 'years_of_experience'
        value = {"$gte": min_experience}  # return all dog_walkers that has min experience and above
    filter_by = {} if key is None else {key: value}

    # check if owner_id exists in dog_owner collection
    collection, cluster = get_collection_from_db(DOG_WALKER)
    walkers = list(collection.find(filter_by))
    cluster.close()
    return walkers


# def __get_people_nearby(coordinates):

if _name_ == "_main_":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True, log_level="info")
    webbrowser.open("http://localhost:8000")