# security.py
import jwt
import os
import logging
from datetime import datetime, timedelta
from utils.constants import *
from utils.user_utils import calc_data_to_users
from dotenv import load_dotenv
import bcrypt
# Load environment variables from a .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("SECRET_KEY", "team")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 2


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # change datetime object to ISO format strings
    date_of_birth = to_encode[USER][DATE_OF_BIRTH]
    if isinstance(date_of_birth, datetime):
        to_encode[USER][DATE_OF_BIRTH] = date_of_birth.date().strftime("%d-%m-%Y")
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info("Access token created successfully")
    return encoded_jwt


def get_access_token(user: dict, user_type: str):
    private_data = {PASSWORD: user[PASSWORD]}
    if user_type == WALKER:
        private_data[RATING] = user[RATING]
        del user[RATING]

    del user[PASSWORD]

    # add age to user and profile_picture_id
    calc_data_to_users([user])
    data = {'user': user, 'private_data': private_data}
    access_token = create_access_token(data=data)
    logger.info(f"Access token generated for user type: {user_type}")
    return {"access_token": access_token, "manager_type": user_type}


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info("Token verified successfully")
        return payload
    except jwt.ExpiredSignatureError:
        logger.error("Token expired")
        return
    except jwt.InvalidTokenError:
        logger.error("Invalid token")
        return
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        return
