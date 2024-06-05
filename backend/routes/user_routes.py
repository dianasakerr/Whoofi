# routes/user_routes.py
import io
import logging

from fastapi import APIRouter, HTTPException, status, File, UploadFile
from backend.security import verify_token
from backend.models.user import DogOwner, DogWalker
from bson.objectid import ObjectId
from pydantic import BaseModel
import bcrypt
from backend.database import *
from pymongo.errors import *
from backend.utils.user_utils import calculate_age, generate_whatsapp_link
from backend.security import create_access_token
from gridfs import GridFS
from datetime import datetime
user_router = APIRouter()

# Get the MongoDB client and GridFS setup
client = get_mongo_client()
db = client[WHOOFI]
fs = GridFS(db)


class SignInReq(BaseModel):
    email: str
    password: str


@user_router.put("/create_user/")
async def create_user(user_type: str, username: str, email: str, longitude: float, latitude: float, phone_number: str,
                      password: str, date_of_birth: str, years_of_experience: float = None, hourly_rate: float = None,
                      file: UploadFile = File(None)):

    user_type = user_type.lower()

    file_id = None
    if file:
        file_contents = await file.read()
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
        file_id = fs.put(file_contents, filename=file.filename, content_type=file.content_type)

    # Convert date_of_birth from string to date object
    try:
        date_of_birth = datetime.strptime(date_of_birth, "%d-%m-%Y")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use DD-MM-YYYY.")

    user_data = {USERNAME: username, EMAIL: email, COORDINATES: [longitude, latitude], PHONE_NUMBER: phone_number,
                 PASSWORD: password, DATE_OF_BIRTH: date_of_birth, PROFILE_PICTURE_ID: str(file_id)}

    # Hash the password before saving
    user_data[PASSWORD] = bcrypt.hashpw(user_data[PASSWORD].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Validate and create user object based on user type
    if user_type == OWNER:
        user_data[DOG] = None
        user = DogOwner(**user_data)
    elif user_type == WALKER:
        if years_of_experience is None or hourly_rate is None:
            raise HTTPException(status_code=400, detail="DogWalker must have years_of_experience and hourly_rate.")
        user_data[YEARS_OF_EXPERIENCE] = years_of_experience
        user_data[HOURLY_RATE] = hourly_rate
        user = DogWalker(**user_data)
    else:
        raise HTTPException(status_code=400, detail="Invalid user type. Please specify 'owner' or 'walker'.")

    access_token = create_access_token(data=dict(user))
    return {"access_token": access_token, "user_type": user_type}


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


def __get_user(email: str, user_type: str, password: bool = False):
    try:
        collection, _ = get_collection_by_user_type(user_type)
        # Find the user by email
        filters = {ID: False} if password else {ID: False, PASSWORD: False}
        user = collection.find_one({EMAIL: email}, filters)
        if user:
            return user
        else:
            print(f"No user found with email: {email}")
            return None
    except errors.PyMongoError as e:
        print(f"Error finding user: {str(e)}")
        raise


@user_router.get("/get_whatsapp_link/")
async def get_whatsapp_link(token: str):
    user = verify_token(token)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    whatsapp_link = generate_whatsapp_link(user[PHONE_NUMBER])
    return whatsapp_link


@user_router.get("/get_user/")
def get_user(token: str):
    user = verify_token(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"})

    user[AGE] = calculate_age(user[DATE_OF_BIRTH])
    file_id = user.get(PROFILE_PICTURE_ID)
    if file_id and PROFILE_PICTURE not in user.keys():
        try:
            file_data = fs.get(ObjectId(file_id))
            file_content = file_data.read()
            if file_content:
                user[PROFILE_PICTURE] = {
                    "content": io.BytesIO(file_content).getvalue().decode('latin1'),  # Convert binary to string
                    "content_type": file_data.content_type}
        except Exception as e:
            logging.error(f"Error retrieving profile picture: {str(e)}")

    return user


@user_router.put("/edit_user/")
async def edit_user(token: str, username: str = None, longitude: float = None, latitude: float = None,
                    phone_number: str = None, date_of_birth: str = None, hourly_rate: float = None,
                    years_of_experience: float = None, file: UploadFile = File(None)):

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

    file_id = None
    # Handle profile picture update
    if file:
        file_contents = await file.read()
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
        # Store the new picture in GridFS
        file_id = fs.put(file_contents, filename=file.filename, content_type=file.content_type)

    # Convert the MongoDB result to a dictionary
    data = {USERNAME: username, COORDINATES: coordinates, PHONE_NUMBER: phone_number, DATE_OF_BIRTH: date_of_birth,
            HOURLY_RATE: hourly_rate, YEARS_OF_EXPERIENCE: years_of_experience, PROFILE_PICTURE_ID: str(file_id)}
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
