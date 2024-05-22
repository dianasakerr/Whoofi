# database.py
from pymongo import MongoClient
from utils.constants import *
CONN_STR = "mongodb+srv://dianasakeer:1234@cluster-1.xgxy3zr.mongodb.net/"


def get_collection(collection_name):
    # Create a new client and connect to the server
    cluster = MongoClient(CONN_STR)
    db = cluster[WHOOFI]
    return db[collection_name], cluster


def get_collection_by_user_type(user_type: str):
    # return the relevant collection and cluster for the specific user type
    if user_type == WALKER:
        collection_name = DOG_WALKER
    elif user_type == OWNER:
        collection_name = DOG_OWNER
    else:
        raise ValueError(f"user type isn`t correct {user_type}")

    # Connect to the MongoDB collection
    collection, cluster = get_collection(collection_name)
    return collection, cluster
