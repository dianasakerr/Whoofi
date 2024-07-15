# routes/dog_routes.py
from fastapi import APIRouter, status, File, UploadFile
from backend.security import *
from gridfs import GridFS
from pymongo.errors import *
from backend.models.dog import *
from backend.database import get_mongo_client

# Get the MongoDB client and GridFS setup
client = get_mongo_client()
db = client[WHOOFI]
fs = GridFS(db)

dog_router = APIRouter()


class DogCustomForm(BaseModel):
    name: str
    date_of_birth: str
    race: str
    weight: float  # in kg


@dog_router.post("/create_dog/")
async def create_dog(token: str, dog_data: DogCustomForm):
    user_data = verify_token(token)
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"})

    user = user_data[USER]

    if user[USER_TYPE] != OWNER:
        raise Exception('only dog owner can have dogs')

    # Convert date_of_birth from string to date object
    try:
        date_of_birth = datetime.strptime(dog_data.date_of_birth, "%d-%m-%Y")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use DD-MM-YYYY.")

    data = {NAME: dog_data.name, DATE_OF_BIRTH: date_of_birth, RACE: dog_data.race, OWNER_EMAIL: user[EMAIL],
            WEIGHT: dog_data.weight}

    dog = Dog(**data)

    # get new user data and generate new token
    collection, cluster = get_collection(DOG_OWNER)
    updated_user = collection.find_one({EMAIL: user[EMAIL]}, {ID: 0})
    new_token = update_token(token, updated_user, OWNER)
    cluster.close()

    return {"message": f"Hello {dog.name}, your data is: {data}", "token": new_token}


@dog_router.put("/upload_dog_picture/")
async def upload_dog_picture(token: str, dog_name: str, file: UploadFile = File(None)):
    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})
    user = data[USER]

    file_id = None
    # Handle profile picture update
    if file:
        file_contents = await file.read()
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
        # Store the new picture in GridFS
        file_id = str(fs.put(file_contents, filename=file.filename, content_type=file.content_type))

    # Update the dog document in MongoDB
    try:
        collection, cluster = get_collection(DOG)
        collection.update_many({OWNER_EMAIL: user[EMAIL], NAME: dog_name}, {"$set": {PROFILE_PICTURE_ID: file_id}})
        cluster.close()
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database update error: {str(e)}")

    return {"message": f"User {user[USERNAME]} dog - {dog_name} updated successfully"}


@dog_router.put("/update_vaccine_status")
def update_vaccination_status(token: str, dog_name: str, vaccine_name: str, vaccine_date: str, vaccine_status: str):
    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})
    user = data[USER]

    dog_collection, dog_cluster = get_collection(DOG)
    dog = dog_collection.find_one({NAME: dog_name, OWNER_EMAIL: user[EMAIL]}, {ID: 0})

    if dog is None:
        raise FileNotFoundError(f'current dog owner {user[USERNAME]} doesn`t have this dog {dog_name}')

    vaccination_status = dog[VACCINATION_STATUS]
    key = f"{vaccine_name}-{vaccine_date}"
    if key in vaccination_status:
        vaccination_status[key]['status'] = vaccine_status
    else:
        raise ValueError(f"{vaccine_name} isn`t in {dog_name} vaccination list")

    # Save the updated vaccination status back to the database
    dog_collection.update_one(
        filter={NAME: dog_name, OWNER_EMAIL: user[EMAIL]},
        update={"$set": {VACCINATION_STATUS: vaccination_status}}
    )
    dog_cluster.close()

    return {"message": f"Vaccination status for {vaccine_name} on {vaccine_date} updated to {vaccine_status}"}


@dog_router.get("/get_vaccination_table")
def get_vaccination_table(token: str, dog_name: str, start_date: str = None):
    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})
    user = data[USER]

    dog_collection, dog_cluster = get_collection(DOG)
    dog_data = dog_collection.find_one({NAME: dog_name, OWNER_EMAIL: user[EMAIL]}, {ID: 0})
    if not dog_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dog not found")

    vaccination_status = dog_data[VACCINATION_STATUS]

    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%d-%m-%Y")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use DD-MM-YYYY.")
    else:
        start_date = datetime.today()

    one_year_from_today = start_date + timedelta(days=90)

    # Ensure all existing and upcoming vaccines within the next year are included
    for vaccine, weeks in REPEATED_VACCINATION_SCHEDULE.items():
        due_date = start_date + timedelta(weeks=weeks)
        while due_date <= one_year_from_today:
            key = f"{vaccine}-{due_date.strftime('%d-%m-%Y')}"
            if key not in vaccination_status:
                vaccination_status[key] = {"vaccine": vaccine, "date": due_date.strftime('%Y-%m-%d'),
                                           "status": "not taken"}
            due_date += timedelta(weeks=weeks)

    updated_vaccination_status = dict(sorted(vaccination_status.items(), key=lambda item: item[1]['date']))
    # Save the updated vaccination status back to the database
    dog_collection.update_one(
        filter={NAME: dog_name, OWNER_EMAIL: user[EMAIL]},
        update={"$set": {VACCINATION_STATUS: updated_vaccination_status}}
    )
    dog_cluster.close()
    filtered_data = {k: v for k, v in updated_vaccination_status.items()
                     if datetime.strptime(v['date'], '%d-%m-%Y').date() >= start_date.date()}

    return dict(sorted(filtered_data.items(), key=lambda item: item[1]['date']))


@dog_router.get("/get_dogs_by_user/")
async def get_dogs_by_user(token: str, owner_email: str = None):
    # Verify token
    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})
    if owner_email is None:
        owner_email = data[USER][EMAIL]

    # Get the dogs associated with the owner email
    dog_collection, dog_cluster = get_collection(DOG)

    try:
        dogs = list(dog_collection.find({OWNER_EMAIL: owner_email}, {ID: 0}))
        calc_data_to_users(dogs, is_dog=True)
        if not dogs:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No dogs found for this owner")
        return dogs
    finally:
        dog_cluster.close()


@dog_router.put("/edit_dog/")
async def edit_dog(token: str, dog_name: str, name: str = None, date_of_birth: str = None, race: str = None,
                   weight: float = None, file: UploadFile = None):

    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})

    user = data[USER]

    dog_collection, dog_cluster = get_collection(DOG)
    dog = dog_collection.find_one(filter={NAME: dog_name, OWNER_EMAIL: user[EMAIL]})

    if name:
        if name in user[DOGS]:
            logger.error(f'dog name {dog_name} already exist for this user {user[EMAIL]}, please choose unique name')
            name = None

    size = None
    if weight:
        size = Dog.get_size(weight)

    file_id = None
    # Handle profile picture update
    if file:
        file_contents = await file.read()
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
        # Store the new picture in GridFS
        file_id = str(fs.put(file_contents, filename=file.filename, content_type=file.content_type))

    # Convert the MongoDB result to a dictionary
    data = {DATE_OF_BIRTH: date_of_birth, PROFILE_PICTURE_ID: file_id, NAME: name, RACE: race, WEIGHT: weight,
            SIZE: size}

    result = {}
    for key, value in data.items():
        if key in dog.keys() and value:
            result[key] = value

    # Update the user document in MongoDB
    try:
        if result:
            dog_collection.update_many({OWNER_EMAIL: user[EMAIL], NAME: dog_name}, {"$set": result})

            if name:
                user_collection, cluster = get_collection(DOG_OWNER)
                user_collection.update_many({EMAIL: user[EMAIL]}, update={'$push': {DOGS: name}})
                user_collection.update_many({EMAIL: user[EMAIL]}, update={'$pull': {DOGS: dog_name}})

                # get new user data and generate new token
                updated_user = user_collection.find_one({EMAIL: user[EMAIL]}, {ID: 0})
                new_token = update_token(token, updated_user, user_type=OWNER)

                dog_cluster.close()
                cluster.close()
                return new_token

        dog_cluster.close()
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database update error: {str(e)}")

    return {"message": f"dog {dog_name} updated successfully"}
