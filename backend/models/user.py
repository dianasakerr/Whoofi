# models/user.py
import re
from pydantic import BaseModel, Field
from typing import Optional, List
from abc import abstractmethod
from backend.database import *
from fastapi import HTTPException
from backend.utils.constants import *
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class User(BaseModel):
    username: str
    email: str
    coordinates: List[float]  # [longitude, latitude]
    phone_number: str
    password: str
    date_of_birth: datetime
    profile_picture_id: Optional[str] = None  # Adding profile_picture_id field
    user_type: str = Field(default="", init=False)

    class Config:
        from_attributes = True

    @abstractmethod
    def save_user(self):

        return {USERNAME: self.username, EMAIL: self.email, COORDINATES: self.coordinates,
                PHONE_NUMBER: self.phone_number, PASSWORD: self.password, DATE_OF_BIRTH: self.date_of_birth,
                PROFILE_PICTURE_ID: self.profile_picture_id, USER_TYPE: self.user_type}

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
        try:
            existing = collection.find_one({EMAIL: self.email})
            if existing:
                raise HTTPException(status_code=400, detail="Email already exists. Please sign in.")
        finally:
            cluster.close()


class DogOwner(User):
    dogs: list = []
    user_type: str = OWNER

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
            logger.info(f"DogOwner {self.username} saved to the database.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"{e} - Please try gain")
        finally:
            cluster.close()


class DogWalker(User):
    years_of_experience: float
    hourly_rate: float
    rating: dict = {}
    avg_rate: float = None
    user_type: str = WALKER

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    def save_user(self):
        self.check_email_uniqueness(DOG_WALKER)

        data = super().save_user()
        other_data = {YEARS_OF_EXPERIENCE: self.years_of_experience, HOURLY_RATE: self.hourly_rate, RATING: self.rating,
                      AVG_RATE: self.avg_rate}
        data.update(other_data)
        collection, cluster = get_collection(DOG_WALKER)
        try:
            # Insert the new user into the database
            collection.insert_one(data)
            logger.info(f"DogWalker {self.username} saved to the database.")
        except Exception as e:
            logger.error(f"Error saving DogWalker: {e}")
            raise HTTPException(status_code=400, detail=f"{e} - Please try gain")
        finally:
            cluster.close()


class Manager(User):
    user_type: str = MANAGER

    def __init__(self, **values):
        super().__init__(**values)
        self.save_user()

    def save_user(self):
        self.check_email_uniqueness(MANAGER)

        data = super().save_user()
        collection, cluster = get_collection(MANAGER)
        try:
            # Insert the new user into the database
            collection.insert_one(data)
            logger.info(f"Manager {self.username} saved to the database.")
        except Exception as e:
            logger.error(f"Error saving Manager: {e}")
            raise HTTPException(status_code=400, detail=f"{e} - Please try again")
        finally:
            cluster.close()

    @classmethod
    def delete_user(cls, email: str, user_type: str):

        user, collection, cluster = get_user_by_type(email, user_type, password=False)
        try:
            result = collection.delete_one({EMAIL: email})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="User not found")
            logger.info(f"User with email {email} deleted from {user_type} collection.")
        except Exception as e:
            logger.error(f"Error deleting user: {e}")
            raise HTTPException(status_code=400, detail=f"{e} - Could not delete user")
        finally:
            if cluster:
                cluster.close()
