# models/user.py
import re

from pydantic import BaseModel
from typing import Optional, List
from abc import abstractmethod
from backend.database import *
from fastapi import HTTPException
from backend.utils.constants import *
from datetime import datetime


class User(BaseModel):
    username: str
    email: str
    coordinates: List[float]  # [longitude, latitude]
    phone_number: str
    password: str
    date_of_birth: datetime
    profile_picture_id: Optional[str] = None  # Adding profile_picture_id field

    class Config:
        from_attributes = True

    @abstractmethod
    def save_user(self):

        return {USERNAME: self.username, EMAIL: self.email, COORDINATES: self.coordinates,
                PHONE_NUMBER: self.phone_number, PASSWORD: self.password, DATE_OF_BIRTH: self.date_of_birth,
                PROFILE_PICTURE_ID: self.profile_picture_id}

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
        except Exception as e:
            cluster.close()
            raise HTTPException(status_code=400, detail=f"{e} - Please try gain")
        cluster.close()


class DogWalker(User):
    years_of_experience: float
    hourly_rate: float

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    def save_user(self):
        self.check_email_uniqueness(DOG_WALKER)
        data = super().save_user()
        data[YEARS_OF_EXPERIENCE] = self.years_of_experience
        data[HOURLY_RATE] = self.hourly_rate
        collection, cluster = get_collection(DOG_WALKER)
        try:
            # Insert the new user into the database
            collection.insert_one(data)
        except Exception as e:
            cluster.close()
            raise HTTPException(status_code=400, detail=f"{e} - Please try gain")
        cluster.close()
