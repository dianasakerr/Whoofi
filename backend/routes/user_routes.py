# routes/user_routes.py
from fastapi import APIRouter, HTTPException
from models.user import DogOwner, DogWalker
from pydantic import BaseModel, Field
import bcrypt
from typing import List
from database import *
from pymongo.errors import *
user_router = APIRouter()


class UserCustomForm(BaseModel):
    user_type: str
    user_data: dict

class SignInReq(BaseModel):
    email: str
    password: str

@user_router.post("/create_user/")
async def create_user(form_data: UserCustomForm):
    user_type = form_data.user_type.lower()
    user_data = form_data.user_data

    # Hash the password before saving
    user_data["password"] = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Determine the user type and create the appropriate user object
    if user_type == 'owner':
        user = DogOwner(**user_data)
    elif user_type == 'walker':
        user = DogWalker(**user_data)
    else:
        raise HTTPException(status_code=400, detail="Invalid user type. Please specify 'owner' or 'walker'.")

    del user_data["password"]
    return {"message": f"Hello {user.username}, your data is: {user_data}"}


@user_router.post("/sign_in/")
async def sign_in(sign_in_data: SignInReq):

    def check_if_user_exists(col):
        # Find the user by email
        user = col.find_one({"email": sign_in_data.email})
        if user and bcrypt.checkpw(sign_in_data.password.encode('utf-8'), user["password"].encode('utf-8')):
            return user

    # Connect to the MongoDB collection
    dog_walker_collection, dog_walker_cluster = get_collection(DOG_WALKER)
    dog_owner_collection, dog_owner_cluster = get_collection(DOG_OWNER)

    dog_walker = check_if_user_exists(dog_walker_collection)
    dog_owner = check_if_user_exists(dog_owner_collection)
    if dog_owner:
        print(f"message Welcome back, {dog_owner['username']}!")
        return True
    if dog_walker:
        print(f"message Welcome back, {dog_walker['username']}!")
        return True

    raise Exception("Email or Password is incorrect, please try again")


@user_router.put("/edit_user/{email}")
async def edit_user(email: str,
                    user_type: str,
                    username: str = None,
                    longitude: float = None,
                    latitude: float = None,
                    phone_number: str = None,
                    age: float = None,
                    hourly_rate: float = None,
                    years_of_experience: float = None
                    ):

    def check_if_user_exists(col):
        # Find the user by email
        usr = col.find({"email": email})
        if usr:
            return usr

    if user_type == 'walker':
        collection_name = DOG_WALKER
    elif user_type == 'owner':
        collection_name = DOG_OWNER
    else:
        raise ValueError(f"user type isn`t correct")

    # Connect to the MongoDB collection
    collection, client = get_collection(collection_name)

    # Find the existing user by email
    user = check_if_user_exists(collection)

    if not user:
        client.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Convert the MongoDB result to a dictionary
    user_data = list(user)[0]
    data = {'username': username, 'longitude': longitude, 'latitude': latitude, 'phone_number': phone_number,
            'age': age, 'hourly_rate': hourly_rate, 'years_of_experience': years_of_experience}
    result = {}
    for key, value in data.items():
        if key in user_data and value:
            result[key] = value

    # Update the user document in MongoDB
    try:
        print(f"user_data = {data}")
        if result:
            collection.update_many({"email": email}, {"$set": result})
    except PyMongoError as e:
        client.close()
        raise HTTPException(status_code=500, detail=f"Database update error: {str(e)}")

    client.close()
    return {"message": f"User {user_data['username']} updated successfully"}
