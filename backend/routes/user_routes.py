# routes/user_routes.py
from fastapi import APIRouter, HTTPException
from backend.models.user import DogOwner, DogWalker
from pydantic import BaseModel
import bcrypt
from backend.database import *
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
    user_data[PASSWORD] = bcrypt.hashpw(user_data[PASSWORD].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Determine the user type and create the appropriate user object
    if user_type == OWNER:
        user = DogOwner(**user_data)
    elif user_type == WALKER:
        user = DogWalker(**user_data)
    else:
        raise HTTPException(status_code=400, detail="Invalid user type. Please specify 'owner' or 'walker'.")

    del user_data[PASSWORD]
    return {"message": f"Hello {user.username}, your data is: {user_data}"}


@user_router.post("/sign_in/")
async def sign_in(sign_in_data: SignInReq):

    dog_owner = __get_user(sign_in_data.email, OWNER, password=True)
    dog_walker = __get_user(sign_in_data.email, WALKER, password=True)

    if dog_owner and bcrypt.checkpw(sign_in_data.password.encode('utf-8'), dog_owner[PASSWORD].encode('utf-8')):
        print(f"message Welcome back, {dog_owner[USERNAME]}!")
        return True
    elif dog_walker and bcrypt.checkpw(sign_in_data.password.encode('utf-8'), dog_walker[PASSWORD].encode('utf-8')):
        print(f"message Welcome back, {dog_walker[USERNAME]}!")
        return True

    return "Email or Password isn`t correct, please try again"


@user_router.get("/get_user/")
def get_user(email: str, user_type: str):
    return __get_user(email, user_type)


def __get_user(email: str, user_type: str, password: bool = False):
    collection, _ = get_collection_by_user_type(user_type)

    # Find the user by email
    filters = {ID: False} if password else {ID: False, PASSWORD: False}
    return collection.find_one({EMAIL: email}, filters)


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

    collection, cluster = get_collection_by_user_type(user_type)
    # Find the user by email
    user = collection.find_one({EMAIL: email}, {ID: False, PASSWORD: False})
    if not user:
        cluster.close()
        raise HTTPException(status_code=404, detail="User not found")

    if longitude or latitude:
        longitude = longitude if longitude else user[COORDINATES][0]
        latitude = latitude if latitude else user[COORDINATES][1]
        coordinates = [longitude, latitude]
    else:
        coordinates = None

    # Convert the MongoDB result to a dictionary
    data = {USERNAME: username, COORDINATES: coordinates, PHONE_NUMBER: phone_number, AGE: age,
            HOURLY_RATE: hourly_rate, YEARS_OF_EXPERIENCE: years_of_experience}
    result = {}
    for key, value in data.items():
        if key in user.keys() and value:
            result[key] = value

    # Update the user document in MongoDB
    try:
        if result:
            collection.update_many({EMAIL: email}, {"$set": result})
    except PyMongoError as e:
        cluster.close()
        raise HTTPException(status_code=500, detail=f"Database update error: {str(e)}")

    cluster.close()
    return {"message": f"User {user[USERNAME]} updated successfully"}
