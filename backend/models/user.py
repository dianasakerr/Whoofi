# models/user.py
import re

from pydantic import BaseModel
from abc import abstractmethod
from database import *
from fastapi import HTTPException
from utils.constants import *


class User(BaseModel):
    username: str
    email: str
    coordinates: list  # [longitude, latitude]
    phone_number: str
    password: str

    class Config:
        from_attributes = True

    @abstractmethod
    def save_user(self):
        return {USERNAME: self.username, EMAIL: self.email, COORDINATES: self.coordinates,
                PHONE_NUMBER: self.phone_number, PASSWORD: self.password}

    def is_valid_email(self, email):

        """
        Validate the email address using a regular expression.

        A valid email should:
        - Start with alphanumeric characters.
        - Allow dots, underscores, plus signs, and hyphens.
        - Followed by an '@' symbol.
        - Followed by a domain name which can be one of: gmail, hotmail, walla, yahoo, outlook, someemail.
        - The domain should end with a valid TLD such as: com, co.il, net, org.

        Valid characters:
        - Alphanumeric characters (a-z, A-Z, 0-9)
        - Special characters: '.', '_', '+', '-'
        - Domain names: gmail, hotmail, walla, yahoo, outlook, someemail
        - TLDs: com, co.il, net, org

        Example of a valid email: username@example.com

        :param email: str, email for the new user
        :return: bool, True if the email is valid, otherwise False
        """
        pattern = re.compile(r'^[a-zA-Z0-9_.+-]+@(gmail|hotmail|walla|yahoo|outlook|someemail)\.(com|co\.il|net|org)$')
        return pattern.match(email) is not None

    def check_email_uniqueness(self, collection_name):
        """
        Check if the email already exists in the database
        :param collection_name: str, DB collection name
        :return:
        """
        # check if email is valid or not
        if not self.is_valid_email(self.email):
            raise HTTPException(status_code=400, detail="invalid email format. please provide a valid email address"
                                                        "Valid characters:"
                                                        "   - Alphanumeric characters (a-z, A-Z, 0-9)"
                                                        "   - Special characters: '.', _, +, -")

        collection, cluster = get_collection(collection_name)
        existing = collection.find_one({EMAIL: self.email})

        if existing:
            cluster.close()
            raise HTTPException(status_code=400, detail="Email already exists. Please sign in.")
        cluster.close()


class DogOwner(User):
    dogs: list = []

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    def save_user(self):
        self.check_email_uniqueness(DOG_OWNER)
        data = super().save_user()
        data[DOGS] = self.dogs
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
        data[AGE] = self.age
        data[YEARS_OF_EXPERIENCE] = self.years_of_experience
        data[HOURLY_RATE] = self.hourly_rate
        collection, cluster = get_collection(DOG_WALKER)
        try:
            # Insert the new user into the database
            collection.insert_one(data)
        except Exception:
            cluster.close()
            raise HTTPException(status_code=400, detail="Please try gain")
        cluster.close()
