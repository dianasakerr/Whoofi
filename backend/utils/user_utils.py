from backend.models.user import *
from datetime import datetime
import bcrypt


def calculate_age(date_of_birth, is_dog: bool = False):
    if isinstance(date_of_birth, str):
        # Convert date_of_birth from string to date object
        try:
            date_of_birth = datetime.strptime(date_of_birth, "%d-%m-%Y")
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid date format {date_of_birth}. Use DD-MM-YYYY.")
    if isinstance(date_of_birth, datetime):
        today = datetime.today()

        # Calculate the differences in years, months, and days
        years = today.year - date_of_birth.year
        months = today.month - date_of_birth.month
        days = today.day - date_of_birth.day

        # Adjust for negative days and months
        if days < 0:
            months -= 1
            days += (today - datetime(today.year, today.month, 1)).days

        if months < 0:
            years -= 1
            months += 12

        if is_dog:
            return f"{years} years and {months} months"
        return f"{years} years"

    raise HTTPException(status_code=400, detail=f"Invalid date format {date_of_birth}. "
                                                f"date_of_birth have to be instance of str or datetime.")


def check_password_uniqueness_across_collections(email: str, password: str, current_user_type: str):
    """
    Check if the same email exists in other collections with a different password.
    :param email: str, email to check
    :param password: str, password to check
    :param current_user_type: str, the name of the current collection being checked
    :return: None, raises HTTPException if the password is not unique
    """
    user_types_to_check = [OWNER, WALKER, MANAGER]
    user_types_to_check.remove(current_user_type)

    for user_type in user_types_to_check:
        collection, cluster = get_collection_by_user_type(user_type)
        try:
            existing_user = collection.find_one({EMAIL: email})
            if existing_user and bcrypt.checkpw(password.encode('utf-8'), existing_user[PASSWORD].encode('utf-8')):
                raise HTTPException(status_code=400,
                                    detail=f"Password must be different for each user type for email: {email}.")
        finally:
            cluster.close()


def calc_data_to_users(users, is_dog=False):
    for usr in users:
        usr[AGE] = calculate_age(usr[DATE_OF_BIRTH], is_dog)
        file_id = usr.get(PROFILE_PICTURE_ID)
        if file_id and PROFILE_PICTURE not in usr.keys():
            usr[PROFILE_PICTURE_URL] = f"/get_profile_picture/{file_id}"
