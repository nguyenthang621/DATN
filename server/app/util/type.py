import jwt
from app.util.utils import convert_time, convert_datetime_to_str


class User:
    def __init__(self, id, fullName, password, email, address, phoneNumber, role, gender, avatar, token, createAt, updateAt):
        self.id = id
        self.fullName = fullName
        self.password = password
        self.email = email
        self.address = address
        self.phoneNumber = phoneNumber
        self.role = role
        self.gender = gender
        self.avatar = avatar
        self.token = token
        self.createAt = convert_datetime_to_str(createAt)
        self.updateAt = convert_datetime_to_str(updateAt)

    def generate_access_token(self):
        payload = {
            'id': self.id,
            'role': self.role,
            'exp': convert_time(12000, 'seconds')
        }
        return "Bearer " + jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')

    def generate_refresh_token(self):
        payload = {
            'id': self.id,
            'role': self.role,
            'exp': convert_time(15, 'days')
        }
        return jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')

    def omit_attributes(self, attributes_to_omit):
        return {attr: getattr(self, attr) for attr in self.__dict__ if attr not in attributes_to_omit}



class Camera:
    def __init__(self, id, name, ip_address, location=None, createAt=None, receiver=None, user_follow=None):
        self.id = id
        self.name = name
        self.ip_address = ip_address
        self.location = location
        self.createAt = convert_datetime_to_str(createAt)
        self.receiver = receiver
        self.user_follow = user_follow

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'ip_address': self.ip_address,
            'location': self.location,
            'createAt': self.createAt,
            'user_follow': self.user_follow,
            'receiver': self.receiver,
        }

    def to_dict_get_all_user(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'createAt': self.createAt
        }

    def omit_attributes(self, attributes):
        for attribute in attributes:
            setattr(self, attribute, None)

