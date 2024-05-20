# models/user.py
from pydantic import BaseModel
from abc import abstractmethod
from database import *
from fastapi import HTTPException


class User(BaseModel):
    username: str
    email: str
    coordinates: list[float]  # [longitude, latitude]
    phone_number: str
    password: str

    class Config:
        from_attributes = True

    @abstractmethod
    def save_user(self):
        return {'username': self.username, 'email': self.email, 'coordinates': self.coordinates,
                'phone_number': self.phone_number, 'password': self.password}

    def check_email_uniqueness(self, collection_name):
        collection, cluster = get_collection(collection_name)
        # Check if the email already exists in the database
        existing = collection.find_one({"email": self.email})

        if existing:
            cluster.close()
            raise HTTPException(status_code=400, detail="Email already exists. Please sign in.")
        cluster.close()


class DogOwner(User):
    dogs: list[str] = []

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    def save_user(self):
        self.check_email_uniqueness(DOG_OWNER)
        data = super().save_user()
        data['dogs'] = self.dogs
        collection, cluster = get_collection(DOG_OWNER)
        try:
            # Insert the new user into the database
            collection.insert_one(data)
        except Exception:
            cluster.close()
            raise HTTPException(status_code=400, detail="Please try gain")
        cluster.close()


class DogWalker(User):
    age: float
    years_of_experience: float
    hourly_rate: float

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    def save_user(self):
        self.check_email_uniqueness(DOG_WALKER)
        data = super().save_user()
        data['age'] = self.age
        data['years_of_experience'] = self.years_of_experience
        data['hourly_rate'] = self.hourly_rate
        collection, cluster = get_collection(DOG_WALKER)
        try:
            # Insert the new user into the database
            collection.insert_one(data)
        except Exception:
            cluster.close()
            raise HTTPException(status_code=400, detail="Please try gain")
        cluster.close()
