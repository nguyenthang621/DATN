import jwt
from app.util.utils import convert_time, convert_datetime_to_str


class User:
    def __init__(self, id, fullName, password, email, address, phoneNumber, role, gender, avatar, createAt, updateAt, token):
        self.id = id
        self.fullName = fullName
        self.password = password
        self.email = email
        self.address = address
        self.phoneNumber = phoneNumber
        self.role = role
        self.gender = gender
        self.avatar = avatar
        self.createAt = convert_datetime_to_str(createAt)
        self.updateAt = convert_datetime_to_str(updateAt)
        self.token = token

    def generate_access_token(self):
        payload = {
            'id': self.id,
            'role': self.role,
            'exp': convert_time(20, 'seconds')
        }
        return "Bearer " + jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')

    def generate_refresh_token(self):
        payload = {
            'id': self.id,
            'role': self.role,
            'exp': convert_time(15, 'days')
        }
        return jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')
