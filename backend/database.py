# database.py
from pymongo import MongoClient, errors
from backend.utils.constants import *
from dotenv import load_dotenv
import os
import logging

# Load environment variables from a .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CONN_STR = os.getenv("MONGO_CONN_STR",
                     "mongodb+srv://dianasakeer:1234@cluster-1.xgxy3zr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-1&tls=true")


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
    except errors.ServerSelectionTimeoutError as e:
        logger.error(f"Failed to connect to MongoDB: Server selection timeout: {e}")
    except errors.ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: Connection failure: {e}")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")


def get_collection(collection_name):
    client = get_mongo_client()
    if client:
        db = client[WHOOFI]
        return db[collection_name], client
    else:
        return None, None


def get_collection_by_user_type(user_type: str):
    if user_type == WALKER:
        collection_name = DOG_WALKER
    elif user_type == OWNER:
        collection_name = DOG_OWNER
    elif user_type == MANAGER:
        collection_name = MANAGER
    else:
        raise ValueError(f"user type isn`t correct {user_type}")

    collection, client = get_collection(collection_name)
    return collection, client


def get_user_by_type(email: str, user_type: str, password: bool = False):
    try:
        collection, client = get_collection_by_user_type(user_type)
        if collection is None or client is None:
            return None, None, None

        # Find the user by email
        filters = {ID: False} if password else {ID: False, PASSWORD: False}
        user = collection.find_one({EMAIL: email}, filters)
        if user:
            return user, collection, client
        else:
            logger.info(f"No user found with email: {email}")

    except errors.PyMongoError as e:
        print(f"Error finding user: {str(e)}")

    return None, None, None
