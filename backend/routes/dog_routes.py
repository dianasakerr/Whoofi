# routes/dog_routes.py
from fastapi import APIRouter, HTTPException
from models.dog import Dog
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