import base64
import json
import datetime
from io import BytesIO

import jwt
from PIL import Image, UnidentifiedImageError
import cv2
import numpy as np


def convert_json(data):
    return json.loads(json.dumps(data.__dict__, ensure_ascii=False))


def convert_time(time: int, time_type: str):
    if time_type == 'seconds':
        return datetime.datetime.utcnow() + datetime.timedelta(seconds=time)
    elif time_type == 'minutes':
        return datetime.datetime.utcnow() + datetime.timedelta(minutes=time)
    elif time_type == 'hours':
        return datetime.datetime.utcnow() + datetime.timedelta(hours=time)
    elif time_type == 'days':
        return datetime.datetime.utcnow() + datetime.timedelta(days=time)
    elif time_type == 'days':
        return datetime.datetime.utcnow() + datetime.timedelta(days=time)


def convert_datetime_to_str(dt):
    if dt == None:
        return ''
    return dt.strftime('%d-%m-%Y')


def base64_to_frame(image_data):
    # Loại bỏ tiền tố 'data:image/jpeg;base64,' để lấy dữ liệu base64 thuần túy
    _, encoded_data = image_data.split(",", 1)

    # Giải mã base64 thành dữ liệu nhị phân
    decoded_data = base64.b64decode(encoded_data)

    # Chuyển đổi dữ liệu nhị phân thành mảng NumPy
    np_data = np.frombuffer(decoded_data, np.uint8)

    # Đọc ảnh từ mảng NumPy
    frame = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

    return frame


def omit_attributes(json_data, attributes):
    if not isinstance(json_data, dict):
        raise ValueError('Input is not a JSON object')

    # Tạo một bản sao của JSON đầu vào
    omitted_json = json_data.copy()

    # Loại bỏ các thuộc tính đã chỉ định
    for attribute in attributes:
        omitted_json.pop(attribute, None)

    return omitted_json


def is_valid_image(image_bytes):
    try:
        Image.open(BytesIO(image_bytes))
        # print("image OK")
        return True
    except UnidentifiedImageError:
        print("image invalid")
        return False


def check_keyword(keywords, string):
    for keyword in keywords:
        if keyword in string:
            return keyword
    return ''


def decodeJWT(auth):
    secret_key = 'SECRET_KEY'
    try:
        if 'Bearer ' in auth:
            token = auth.split(' ')[1]
            decoded_jwt = jwt.decode(token, secret_key, algorithms=['HS256'])
            return decoded_jwt
        return None
    except jwt.ExpiredSignatureError:
        print("JWT has expired.")
    except jwt.InvalidTokenError:
        print("Invalid JWT.")



