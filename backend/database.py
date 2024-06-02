from pymongo import MongoClient, errors
from utils.constants import *

CONN_STR = "mongodb+srv://dianasakeer:1234@cluster-1.xgxy3zr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-1"


def get_mongo_client():
    try:
        client = MongoClient(
            CONN_STR,
            serverSelectionTimeoutMS=5000,  # Adjust the timeout as needed
            tls=True,  # Ensure TLS/SSL is used
            # Use if you are using self-signed certificates (not recommended for production)
            tlsAllowInvalidCertificates=True
        )
        # Attempt to retrieve server information to force connection
        client.admin.command('ping')
        print("Connected to MongoDB!")
        return client
    except errors.ServerSelectionTimeoutError as err:
        print("Failed to connect to MongoDB", err)
        raise
    except errors.PyMongoError as err:
        print("MongoDB connection error: ", err)
        raise


def get_collection(collection_name):
    client = get_mongo_client()
    db = client[WHOOFI]
    return db[collection_name], client


def get_collection_by_user_type(user_type: str):
    if user_type == WALKER:
        collection_name = DOG_WALKER
    elif user_type == OWNER:
        collection_name = DOG_OWNER
    else:
        raise ValueError(f"user type isn`t correct {user_type}")

    collection, client = get_collection(collection_name)
    return collection, client
