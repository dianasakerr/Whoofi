# routes/dog_routes.py
from fastapi import APIRouter, HTTPException
from backend.models.dog import Dog
from pydantic import BaseModel
from typing import Dict

dog_router = APIRouter()


class DogCustomForm(BaseModel):
    user_data: Dict


@dog_router.post("/create_dog/")
async def create_dog(form_data: DogCustomForm):
    dog_data = form_data.user_data
    dog = Dog(**dog_data)
    # TODO: add the dog to user dogs list
    return {"message": f"Hello {dog.name}, your data is: {dog_data}"}


@dog_router.get("/get_dogs_by_user/")
async def get_dogs_by_user(user_email: str, token: str):
    # Verify token
    data = verify_token(token)
    if data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})

    # Get the dogs associated with the owner email
    dog_collection, dog_cluster = get_collection(DOG)

    try:
        dogs = list(dog_collection.find({OWNER_EMAIL: user_email}, {ID: 0}))
        calc_data_to_users(dogs)
        if not dogs:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No dogs found for this owner")
        return dogs
    finally:
        dog_cluster.close()
