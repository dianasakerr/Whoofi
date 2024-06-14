# routes/walker_routes.py
from backend.database import *
from pymongo import GEOSPHERE
from datetime import datetime, timedelta
from backend.security import verify_token
from backend.utils.user_utils import calc_data_to_users
from fastapi import APIRouter, HTTPException, status
import numpy as np
import re

walker_router = APIRouter()


@walker_router.put("/add_rating/")
def add_rating(token: str, walker_email: str, rate: float):
    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})

    user = data.get(USER, {})
    if user.get(USER_TYPE) != OWNER:
        error_message = "only Dog Owner can rate Dog Walkers"
        print(error_message)
        return error_message

    walker, collection, client = get_user_by_type(email=walker_email, user_type=WALKER)
    if not walker:
        error_message = f"Dog walker with email {walker_email} not found"
        print(error_message)
        return error_message

    if not (0 <= rate <= 5):
        error_message = f'Illegal rating number {rate} ' \
                        f'Dog Walker rate must be in range 0-5.'
        print(error_message)
        return error_message

    # Update the rating list and calculate the average
    rating = walker[RATING]
    rating[user[EMAIL]] = rate
    avg = {AVG_RATE: np.average(list(walker[RATING].values()))}

    # Update the user document in MongoDB
    collection.update_one({EMAIL: walker[EMAIL]}, {"$set": {RATING: rating, AVG_RATE: avg[AVG_RATE]}})
    client.close()

    return "Rating added successfully"


@walker_router.get("/get_dog_walkers/")
async def get_dog_walkers(token: str, name: str = None, location_radius_km: float = None, latitude: float = None,
                          longitude: float = None, min_experience: float = None, max_price: float = None,
                          min_age: float = None):
    
    dog_walkers_collection, dog_walkers_cluster = get_collection(DOG_WALKER)

    filter_by = {}
    if name:
        pattern = re.compile(name, re.IGNORECASE)
        filter_by[USERNAME] = {"$regex": pattern}

    if location_radius_km:
        # if latitude and longitude passed use it otherwise use coordinates
        if latitude and longitude:
            center_location = [longitude, latitude]
        else:
            data = verify_token(token)
            if data is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                                    headers={"WWW-Authenticate": "Bearer"})
            user = data[USER]
            center_location = user[COORDINATES]

        try:
            dog_walkers_collection.create_index([(COORDINATES, GEOSPHERE)])
            print("Geospatial index created successfully.")
        except Exception as e:
            print(f"Could not create geospatial index: {e}")

        # MongoDB requires radius in radians for spherical calculations
        radius_in_radians = location_radius_km / 6378.1  # Earth's radius in kilometers
        filter_by[COORDINATES] = {"$geoWithin": {"$centerSphere": [center_location, radius_in_radians]}}

    # Filter by minimum years of experience
    if min_experience:
        filter_by[YEARS_OF_EXPERIENCE] = {"$gte": min_experience}

    # Filter by price range
    if max_price:
        price_filter = {}
        if max_price:
            price_filter["$lte"] = max_price
        filter_by[HOURLY_RATE] = price_filter

    # Filter by age range
    if min_age:
        current_date = datetime.utcnow()
        min_birth_date = current_date - timedelta(days=min_age * 365.25)
        filter_by[DATE_OF_BIRTH] = {"$lte": min_birth_date}

    projection = {ID: 0, PASSWORD: 0, PROFILE_PICTURE_URL: 0, RATED_USERS: 0}

    try:
        walkers = list(dog_walkers_collection.find(filter_by, projection))
        calc_data_to_users(walkers)
        return walkers

    except Exception as e:
        print(e)
        return []
