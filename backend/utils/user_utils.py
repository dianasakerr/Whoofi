from datetime import datetime


def calculate_age(date_of_birth: str):
    today = datetime.today()
    birth_date = datetime.strptime(date_of_birth, "%Y-%m-%d")
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age


def generate_whatsapp_link(phone_number: str) -> str:
    if phone_number.startswith('0'):
        phone_number = phone_number[1:]
    return f"https://api.whatsapp.com/send/?phone={phone_number}&text&type=phone_number&app_absent=0"
