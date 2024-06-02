# routes/user_routes.py
from fastapi import APIRouter, HTTPException, status
from backend.security import verify_token
from backend.models.user import DogOwner, DogWalker
from pydantic import BaseModel
import bcrypt
from backend.database import *
from pymongo.errors import *
from backend.security import create_access_token
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

    user = dog_owner if dog_owner else dog_walker
    user_type = OWNER if dog_owner else WALKER

    if user and bcrypt.checkpw(sign_in_data.password.encode('utf-8'), user[PASSWORD].encode('utf-8')):
        print(f"message Welcome back, {user[USERNAME]}!")
        # create token access
        user[USER_TYPE] = user_type
        access_token = create_access_token(data=user)
        return {"access_token": access_token, "user_type": user_type}

    raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="email or password are incorrect",
                        headers={"WWW-Authenticate": "Bearer"})


@user_router.get("/get_user/")
def get_user(token: str):
    user = verify_token(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def __get_user(email: str, user_type: str, password: bool = False):
    collection, _ = get_collection_by_user_type(user_type)
    # Find the user by email
    filters = {ID: False} if password else {ID: False, PASSWORD: False}
    return collection.find_one({EMAIL: email}, filters)


@user_router.put("/edit_user/")
async def edit_user(token: str, username: str = None, longitude: float = None, latitude: float = None,
                    phone_number: str = None, age: float = None, hourly_rate: float = None,
                    years_of_experience: float = None):

    user = verify_token(token)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})

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
        collection, cluster = get_collection_by_user_type(user[USER_TYPE])
        if result:
            collection.update_many({EMAIL: user[EMAIL]}, {"$set": result})
        cluster.close()
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database update error: {str(e)}")

    cluster.close()
    return {"message": f"User {user[USERNAME]} updated successfully"}
