import jwt
from datetime import datetime, timedelta
from backend.utils.constants import DATE_OF_BIRTH
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60*2


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # change datetime object to ISO format strings
    date_of_birth = to_encode[DATE_OF_BIRTH]
    if isinstance(date_of_birth, datetime):
        to_encode[DATE_OF_BIRTH] = date_of_birth.date().strftime("%d-%m-%Y")
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
