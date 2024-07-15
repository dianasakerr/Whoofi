# models/dog.py
from pydantic import BaseModel
from typing import Optional, Dict
from backend.utils.constants import *
from backend.database import get_collection
from fastapi import HTTPException
from datetime import timedelta, datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

VACCINATION_SCHEDULE_FOR_PUPPIES = {
    "חיסון משושה ראשון": 8,
    "חיסון משושה שני": 12,
    " חיסון כלבת + שבב": 13,
    "חיסון משושה שלישי": 16,
}

REPEATED_VACCINATION_SCHEDULE = {
    "משושה": 52,  # 1 year
    "כלבת": 52,  # 1 year
    "טיפול מונע כנגד תולעים": 26,  # 6 months
    "טיפול מונע כנגד תולעת הפארק": 13,  # 3 months
}


class Dog(BaseModel):
    name: str
    date_of_birth: datetime
    race: str
    owner_email: str
    weight: float  # in kg
    size: Optional[str] = None
    vaccination_status: Optional[Dict] = None
    profile_picture_id: Optional[str] = None  # Adding profile_picture_id field

    def __init__(self, **values):
        super().__init__(**values)
        self.size = self._get_size()
        self.vaccination_status = self.set_default_vaccination_schedule()
        self.check_name_uniqueness()
        self.save_dog()

    def _get_size(self):
        if self.weight <= 10:
            return SMALL
        if self.weight <= 25:
            return MEDIUM
        return BIG

    @classmethod
    def get_size(cls, weight):
        if weight <= 10:
            return SMALL
        if weight <= 25:
            return MEDIUM
        return BIG

    def check_name_uniqueness(self):
        """
        Check if the email already exists in the database
        :return:
        """
        collection, cluster = get_collection(DOG)
        try:
            existing = collection.find_one({OWNER_EMAIL: self.owner_email, NAME: self.name})
            if existing:
                raise HTTPException(status_code=400, detail=f"Dog name for {self.owner_email} already exists.")
        finally:
            cluster.close()

    def set_default_vaccination_schedule(self):
        # Define vaccination schedule (vaccine name: age in weeks when the vaccine should be given)
        schedule = {}

        # Add puppy vaccination schedule
        for vaccine, weeks in VACCINATION_SCHEDULE_FOR_PUPPIES.items():
            due_date = self.date_of_birth + timedelta(weeks=weeks)
            key = f"{vaccine}-{due_date.strftime('%d-%m-%Y')}"
            schedule[key] = {"vaccine": vaccine, "date": due_date.strftime('%d-%m-%Y'), "status": "not taken"}

        # Add repeated vaccination schedule up to one year from today
        today = datetime.today()
        one_year_from_today = today + timedelta(days=365)
        for vaccine, weeks in REPEATED_VACCINATION_SCHEDULE.items():
            due_date = self.date_of_birth + timedelta(weeks=weeks)
            while due_date <= one_year_from_today:
                key = f"{vaccine}-{due_date.strftime('%d-%m-%Y')}"
                schedule[key] = {"vaccine": vaccine, "date": due_date.strftime('%d-%m-%Y'), "status": "not taken"}
                due_date += timedelta(weeks=weeks)

        return schedule

    def save_dog(self):
        dog_owner_cluster, cluster = None, None
        try:
            # check if owner_email exists in dog_owner collection
            dog_owner_collection, dog_owner_cluster = get_collection(DOG_OWNER)
            owner_exists = dog_owner_collection.find_one({EMAIL: self.owner_email}) is not None

            if not owner_exists:
                raise ValueError(f"Owner with ID {self.owner_email} does not exist.")

            data = {NAME: self.name, RACE: self.race, OWNER_EMAIL: self.owner_email, WEIGHT: self.weight,
                    SIZE: self.size, DATE_OF_BIRTH: self.date_of_birth, VACCINATION_STATUS: self.vaccination_status,
                    PROFILE_PICTURE_ID: self.profile_picture_id}
            collection, cluster = get_collection(DOG)
            collection.insert_one(data)
            logger.info(f"Dog {self.name} saved to the database.")

            # update dog owner dogs list
            dog_owner_collection.update_one(filter={EMAIL: self.owner_email}, update={'$push': {DOGS: self.name}})
            logger.info(f"Dog {self.name} added to the owner's list of dogs.")
        except Exception as e:
            logger.error(f"Error saving dog: {e}")
        finally:
            if dog_owner_cluster:
                dog_owner_cluster.close()
            if cluster:
                cluster.close()
