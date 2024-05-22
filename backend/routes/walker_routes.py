# routes/walker_routes.py
from fastapi import APIRouter
from backend.database import *
from pymongo import GEOSPHERE
import re
from typing import List

walker_router = APIRouter()


@walker_router.get("/get_dog_walkers/")
# TODO: if coordinates is None take from user db
async def get_dog_walkers(name: str = None,
                          location_radius_km: float = 2,
                          latitude: float = None,
                          longitude: float = None,
                          min_experience: float = None,
                          max_price: float = None,
                          min_age: float = None
                          ):
    
    dog_walkers_collection, dog_walkers_cluster = get_collection(DOG_WALKER)

    filter_by = {}
    if name:
        pattern = re.compile(name, re.IGNORECASE)
        filter_by[USERNAME] = {"$regex": pattern}

    if latitude and longitude:
        center_location = [longitude, latitude]
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
        age_filter = {}
        if min_age:
            age_filter["$gte"] = min_age
        filter_by["age"] = age_filter

    projection = {
        ID: 0,
        EMAIL: 1,
        USERNAME: 1,
        COORDINATES: 1,
        PHONE_NUMBER: 1,
        AGE: 1,
        HOURLY_RATE: 1,
        YEARS_OF_EXPERIENCE: 1
    }
    try:
        return list(dog_walkers_collection.find(filter_by, projection))
    except Exception as e:
        print(e)
        return []
