# routes/user_routes.py
import io

from fastapi import APIRouter, status, File, UploadFile
from fastapi.responses import StreamingResponse
from bson.objectid import ObjectId
from pymongo.errors import *
from backend.utils.user_utils import *
from backend.security import *
from gridfs import GridFS
from datetime import datetime
from backend.database import get_mongo_client
from typing import Optional

user_router = APIRouter()

# Get the MongoDB client and GridFS setup
client = get_mongo_client()
db = client[WHOOFI]
fs = GridFS(db)


class SignInReq(BaseModel):
    email: str
    password: str


class CreateUsrReq(BaseModel):
    user_type: str
    username: str
    email: str
    longitude: float
    latitude: float
    phone_number: str
    password: str
    date_of_birth: str
    years_of_experience: Optional[float] = None
    hourly_rate: Optional[float] = None


@user_router.post("/create_user/")
async def create_user(data: CreateUsrReq):

    user_type = data.user_type.lower()

    # Convert date_of_birth from string to date object
    try:
        date_of_birth = datetime.strptime(data.date_of_birth, "%d-%m-%Y")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use DD-MM-YYYY.")

    user_data = {USERNAME: data.username, EMAIL: data.email, COORDINATES: [data.longitude, data.latitude],
                 PHONE_NUMBER: data.phone_number, PASSWORD: data.password, DATE_OF_BIRTH: date_of_birth}

    # Check password uniqueness before hashing
    check_password_uniqueness_across_collections(data.email, data.password, user_type)

    # Hash the password before saving
    user_data[PASSWORD] = hash_password(data.password)

    # Validate and create user object based on user type
    if user_type == OWNER:
        user_data[DOG] = None
        user = DogOwner(**user_data)
    elif user_type == WALKER:
        if data.years_of_experience is None or data.hourly_rate is None:
            raise HTTPException(status_code=400, detail="DogWalker must have years_of_experience and hourly_rate.")
        user_data[YEARS_OF_EXPERIENCE] = data.years_of_experience
        user_data[HOURLY_RATE] = data.hourly_rate
        user = DogWalker(**user_data)
    else:
        raise HTTPException(status_code=400, detail="Invalid user type. Please specify 'owner' or 'walker'.")

    return get_access_token(user=dict(user), user_type=user_type)


@user_router.put("/upload_profile_picture/")
async def upload_profile_picture(token: str, file: UploadFile = File(None)):

    result = await edit_user(token=token, file=file)
    return result


@user_router.delete("/delete_user/")
async def delete_user(token: str, email: str, user_type: str):

    data = verify_token(token)
    manager = data.get(USER, {})
    manager_type = manager.get(USER_TYPE)

    dog_owner, _, _ = get_user_by_type(email, OWNER, password=True)
    dog_walker, _, _ = get_user_by_type(email, WALKER, password=True)

    user_type = OWNER if dog_owner else WALKER

    if manager is None or manager_type != MANAGER or user_type == MANAGER:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access",
                            headers={"WWW-Authenticate": "Bearer"})

    Manager.delete_user(email, user_type)
    return {"message": f"User with email {email} deleted successfully"}


@user_router.get("/see_all_users/")
async def see_all_users(token: str, user_type: Optional[str] = None, max_age: Optional[int] = None):

    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})
    user = data[USER]

    if user is None or user.get(USER_TYPE) != MANAGER:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access",
                            headers={"WWW-Authenticate": "Bearer"})
    if user_type and user_type not in [OWNER, WALKER, MANAGER]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="manager_type is not valid",
                            headers={"WWW-Authenticate": "Bearer"})

    filter_by = {}
    if max_age:
        current_date = datetime.utcnow()
        max_birth_age = current_date - timedelta(days=max_age * 365.25)
        filter_by[DATE_OF_BIRTH] = {"$gte": max_birth_age}

    users_types = [OWNER, WALKER, MANAGER] if user_type is None else [user_type]
    all_users = []
    for user_type in users_types:
        collection, cluster = get_collection_by_user_type(user_type)
        try:
            users = list(collection.find(filter_by, {PASSWORD: False, ID: False}))
            all_users.extend(users)
        finally:
            cluster.close()

    calc_data_to_users(all_users)
    return all_users


@user_router.post("/sign_in/")
async def sign_in(sign_in_data: SignInReq):

    dog_owner, _, _ = get_user_by_type(sign_in_data.email, OWNER, password=True)
    dog_walker, _, _ = get_user_by_type(sign_in_data.email, WALKER, password=True)
    manager, _, _ = get_user_by_type(sign_in_data.email, MANAGER, password=True)

    user = dog_owner if dog_owner else dog_walker if dog_walker else manager
    user_type = OWNER if dog_owner else WALKER if dog_walker else MANAGER

    if user and bcrypt.checkpw(sign_in_data.password.encode('utf-8'), user[PASSWORD].encode('utf-8')):
        print(f"message Welcome back, {user[USERNAME]}!")
        # create token access
        user[USER_TYPE] = user_type
        return get_access_token(user, user_type)

    raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="email or password are incorrect",
                        headers={"WWW-Authenticate": "Bearer"})


@user_router.get("/get_user/")
def get_user(token: str):
    data = verify_token(token)
    if data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"})

    return data[USER]


@user_router.get("/get_profile_picture/")
def get_profile_picture(file_id: str):
    try:
        file_data = fs.get(ObjectId(file_id))
        return StreamingResponse(io.BytesIO(file_data.read()), media_type=file_data.content_type)
    except Exception as e:
        logging.error(f"Error retrieving profile picture: {str(e)}")
        raise HTTPException(status_code=404, detail="Profile picture not found")


@user_router.put("/edit_user/")
async def edit_user(token: str, username: str = None, longitude: float = None, latitude: float = None,
                    phone_number: str = None, date_of_birth: str = None, hourly_rate: float = None,
                    years_of_experience: float = None, file: UploadFile = File(None)):

    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})

    user = data[USER]
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
        file_id = str(fs.put(file_contents, filename=file.filename, content_type=file.content_type))

    # Convert the MongoDB result to a dictionary
    data = {USERNAME: username, COORDINATES: coordinates, PHONE_NUMBER: phone_number, DATE_OF_BIRTH: date_of_birth,
            HOURLY_RATE: hourly_rate, YEARS_OF_EXPERIENCE: years_of_experience, PROFILE_PICTURE_ID: file_id}
    result = {}
    for key, value in data.items():
        if key in user.keys() and value:
            result[key] = value

    # Update the user document in MongoDB
    try:
        collection, cluster = get_collection_by_user_type(user[USER_TYPE])
        if result:
            collection.update_many({EMAIL: user[EMAIL]}, {"$set": result})

            # get new user data and generate new token
            updated_user = collection.find_one({EMAIL: user[EMAIL]}, {ID: 0})
            new_token = update_token(token, updated_user, OWNER)
            cluster.close()
            return {"message": f"User {user[USERNAME]} updated successfully, ", "token": new_token}
        cluster.close()
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database update error: {str(e)}")

    return {"message": f"User {user[USERNAME]} updated successfully"}
