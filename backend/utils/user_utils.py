from datetime import datetime
from fastapi import HTTPException


def calculate_age(date_of_birth):
    if isinstance(date_of_birth, str):
        # Convert date_of_birth from string to date object
        try:
            date_of_birth = datetime.strptime(date_of_birth, "%d-%m-%Y")
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid date format {date_of_birth}. Use DD-MM-YYYY.")
    if isinstance(date_of_birth, datetime):
        today = datetime.today()
        age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
        return age

    raise HTTPException(status_code=400, detail=f"Invalid date format {date_of_birth}. "
                                                f"date_of_birth have to be instance of str or datetime.")


def generate_whatsapp_link(phone_number: str) -> str:
    if phone_number.startswith('0'):
        phone_number = phone_number[1:]
    return f"https://api.whatsapp.com/send/?phone={phone_number}&text&type=phone_number&app_absent=0"
