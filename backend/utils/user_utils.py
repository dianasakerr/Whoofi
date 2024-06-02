from datetime import datetime


def calculate_age(date_of_birth: str):
    today = datetime.today()
    birth_date = datetime.strptime(date_of_birth, "%Y-%m-%d")
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age
