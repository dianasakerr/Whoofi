# database.py
from pymongo import MongoClient

CONN_STR = "mongodb+srv://dianasakeer:1234@cluster-1.xgxy3zr.mongodb.net/"
DB_NAME = 'Whoofi'

DOG_OWNER = 'dog_owner'
DOG_WALKER = 'dog_walker'
DOG = 'dog'


def get_collection(collection_name):
    # Create a new client and connect to the server
    cluster = MongoClient(CONN_STR)
    db = cluster[DB_NAME]
    return db[collection_name], cluster
